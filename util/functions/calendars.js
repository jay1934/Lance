const { DateTime } = require('luxon');
const CalendarAPI = require('@mchangrh/node-google-calendar');
const { MessageEmbed } = require('discord.js');
const columnify = require('columnify');
const defer = require('promise-defer');
const dates = require('./dates.js');
const { log } = require('./general.js');
const database = require('./database.js');
const {
  private_key,
  client_email,
} = require('../../config/security/google.json');

const { Events } = new CalendarAPI({
  key: private_key,
  serviceAcctId: client_email,
  timezone: 'UTC+00:00',
});

module.exports = {
  Events,
  autoUpdater: [],
  timerCount: [],
  createDayMap(message) {
    const dayMap = [];
    const tz = dates.getValidTz(message.guild.id);
    const d = DateTime.fromJSDate(new Date()).setZone(tz).startOf('day');
    dayMap[0] = d;
    for (let i = 1; i < 7; i++) {
      dayMap[i] = d.plus({ days: i });
    }
    return dayMap;
  },

  getEvents(message, calendarID, dayMap) {
    try {
      const calendar = database.getGuildSettings(message.guild.id, 'calendar');
      const tz = dates.getValidTz(message.guild.id);
      let matches = [];

      Events.list(calendarID, {
        timeMin: dayMap[0].toISO(),
        timeMax: dayMap[6].endOf('day').toISO(),
        singleEvents: true,
        orderBy: 'startTime',
        timeZone: tz,
      })
        .then((json) => {
          for (
            let day = 0, date = new Date().getDay();
            day < 7;
            day++, date++
          ) {
            const key = `day${day}`;
            matches = [];

            for (let i = 0; i < json.length; i++) {
              let eStartDate;
              if (json[i].start.dateTime) {
                eStartDate = DateTime.fromISO(json[i].start.dateTime, {
                  setZone: true,
                });
              } else if (json[i].start.date) {
                eStartDate = DateTime.fromISO(json[i].start.date, {
                  zone: tz,
                });
              }
	      // log(`eStartDate.weekday: ${eStartDate.weekday}  date: ${date}  day: ${eStartDate.day}`);
	      if (date > 7) {
	        date = 1;
	      }
	      if ((eStartDate.weekday) === (date)) {
                matches.push({
                  id: json[i].id,
                  summary: json[i].summary,
                  start: json[i].start,
                  end: json[i].end,
                });
              }
              calendar[key] = matches;
            }
          }
          calendar.lastUpdate = new Date();
          database.writeGuildSpecific(
            message.guild.id,
            calendar,
            'calendar.json'
          );
        })
        .catch((err) => {
          if (err.message.includes('notFound')) {
            log(
              `function getEvents error in guild: ${message.guild.id} : 404 error can't find calendar`
            );
            message.channel.send(
              "I can't seem to find your calendar! This is usually because you haven't invited Lance to access your calendar, run `!L setup` to make sure you followed Step 1.\n" +
                'You should also check that you have entered the correct calendar id using `!L id`.'
            );
            clearInterval(this.autoUpdater[message.guild.id]);
            try {
              delete this.timerCount[message.guild.id];
              message.channel.send('update timer has been killed.');
            } catch (e) {
              log(e);
            }
            return;
          }
          if (err.message.includes('Invalid Credentials'))
            return log(
              `function getEvents error in guild: ${message.guild.id} : 401 invalid credentials`
            );

          log(
            `function getEvents error in guild: ${message.guild.id} : ${err}`
          );
          clearInterval(this.autoUpdater[message.guild.id]);
        });
    } catch (err) {
      message.channel.send(err.code);
      return log(
        `Error in function getEvents in guild: ${message.guild.id} : ${err}`
      );
    }
  },

  generateCalendar(message, dayMap) {
    const calendar = database.getGuildSettings(message.guild.id, 'calendar');
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    const p = defer();
    let finalString = '';
    for (let i = 0; i < 7; i++) {
      const key = `day${String(i)}`;
      let sendString = '';
      sendString += `\n**${dayMap[i].toLocaleString({
        weekday: 'long',
      })}** - ${dayMap[i].toLocaleString({
        month: 'long',
        day: '2-digit',
      })}`;
      if (!+settings.emptydays && !calendar[key].length === 0) continue;

      if (!calendar[key].length) sendString += '``` ```';
      else {
        sendString += '```';
        for (let m = 0; m < calendar[key].length; m++) {
          const options = {
            showHeaders: false,
            columnSplitter: ' | ',
            columns: ['time', 'events'],
            config: {
              time: {
                minWidth: settings.format === 24 ? 15 : 20,
                align: 'center',
              },
              events: {
                minWidth: 30,
              },
            },
          };
          const eventTitle =
            settings.trim !== null &&
            settings.trim !== 0 &&
            calendar[key][m].summary.length > settings.trim
              ? `${calendar[key][m].summary
                  .trim()
                  .substring(0, settings.trim - 3)}...`
              : calendar[key][m].summary;

          if (Object.keys(calendar[key][m].start).includes('date')) {
            const tempString = {};
            tempString['All Day'] = eventTitle;
            sendString += `${columnify(tempString, options)}\n`;
          } else if (Object.keys(calendar[key][m].start).includes('dateTime')) {
            const tempString = {};
            tempString[
              dates.getStringTime(
                calendar[key][m].start.dateTime,
                message.guild.id
              )
            ] = eventTitle;
            sendString += `${columnify(tempString, options)}\n`;
          }
        }
        sendString += '```';
      }
      finalString += sendString;
      if (finalString.length > 2048) {
        message.channel.send(
          'Your total calendar length exceeds 2048 characters - this is a Discord limitation - Try reducing the length of your event names or total number of events'
        );
        p.reject(2048);
        return p.promise;
      }
    }
    const embed = new MessageEmbed();
    embed.setTitle('CALENDAR');
    embed.setURL(
      `https://calendar.google.com/calendar/embed?src=${settings.calendarID}`
    );
    embed.setColor('BLUE');
    embed.setDescription(finalString);
    embed.setFooter('Last update');
    if (settings.helpmenu === '1')
      embed.addField(
        'USING THIS CALENDAR',
        'To create events use `!L create` or `!L scrim` followed by your event details i.e. `!L create xeno on November 12 at 8pm-10pm`\n\nTo delete events use `!L delete <event_name>` i.e. `!L delete xeno`\n\nHide this message using `!L displayoptions help 0`\n\nEnter `!L help` for a full list of commands.',
        false
      );

    if (settings.tzDisplay === '1')
      embed.addField('Timezone', settings.timezone, false);

    embed.setTimestamp(new Date());
    p.resolve(embed);
    return p.promise;
  },

  startUpdateTimer(message) {
    if (!this.timerCount[message.guild.id])
      this.timerCount[message.guild.id] = 0;

    const { calendarID } = database.getGuildSettings(
      message.guild.id,
      'settings'
    );

    const dayMap = this.createDayMap(message);
    if (!this.autoUpdater[message.guild.id]) {
      this.timerCount[message.guild.id] += 1;
      log(`Starting update timer in guild: ${message.guild.id}`);
      this.autoUpdater[message.guild.id] = setInterval(
        () =>
          this.calendarUpdater(
            message,
            calendarID,
            dayMap,
            this.timerCount[message.guild.id]
          ),
        message.client.config.calendars.calendarUpdateInterval
      );
      return;
    }
    if (
      this.autoUpdater[message.guild.id]._idleTimeout !==
      message.client.config.calendars.calendarUpdateInterval
    ) {
      try {
        this.timerCount[message.guild.id] += 1;
        log(`Starting update timer in guild: ${message.guild.id}`);
        this.autoUpdater[message.guild.id] = setInterval(
          () =>
            this.calendarUpdater(
              message,
              calendarID,
              dayMap,
              this.timerCount[message.guild.id]
            ),
          message.client.config.calendars.calendarUpdateInterval
        );
        return;
      } catch (err) {
        log(`error starting the autoupdater${err}`);
        clearInterval(this.autoUpdater[message.guild.id]);
        delete this.timerCount[message.guild.id];
      }
    } else {
      return log(`timer not started in guild: ${message.guild.id}`);
    }
  },

  postCalendar(message, dayMap) {
    try {
      const calendar = database.getGuildSettings(message.guild.id, 'calendar');
      const settings = database.getGuildSettings(message.guild.id, 'settings');
      if (calendar.calendarMessageId) {
        message.channel.messages
          .fetch(calendar.calendarMessageId)
          .then((msg) => msg.delete())
          .catch((err) => {
            if (err.code === 10008) {
              calendar.calendarMessageId = '';
              database.writeGuildSpecific(
                message.guild.id,
                calendar,
                'calendar.json'
              );
              return log(
                `error fetching previous calendar in guild: ${message.guild.id}:${err}`
              );
            }
            return log(
              `error fetching previous calendar in guild: ${message.guild.id}:${err}`
            );
          });
      }
      this.generateCalendar(message, dayMap)
        .then((embed) => {
          if (embed === 2048) return;
          message.channel.send(embed).then((sent) => {
            calendar.calendarMessageId = sent.id;
            if (settings.pin === '1' || settings.pin == null) sent.pin();
          });
        })
        .then(() =>
          setTimeout(() => {
            database.writeGuildSpecific(
              message.guild.id,
              calendar,
              'calendar.json'
            );
            setTimeout(() => this.startUpdateTimer(message), 2000);
          }, 2000)
        )
        .catch((err) =>
          err === 2048
            ? log(
                `funtion postCalendar error in guild: ${message.guild.id}: ${err} - Calendar too long`
              )
            : log(
                `funtion postCalendar error in guild: ${message.guild.id}: ${err}`
              )
        );
    } catch (err) {
      message.channel.send(err.code);
      return log(
        `Error in post calendar in guild: ${message.guild.id} : ${err}`
      );
    }
  },

  updateCalendar(message, dayMap, human) {
    const calendar = database.getGuildSettings(message.guild.id, 'calendar');
    if (typeof calendar === 'undefined') {
      log(`calendar undefined in ${message.guild.id}. Killing update timer.`);
      clearInterval(this.autoUpdater[message.guild.id]);
      try {
        delete this.timerCount[message.guild.id];
        message.channel.send('update timer has been killed.');
      } catch (err) {
        log(err);
      }
      return;
    }
    if (calendar.calendarMessageId === '') {
      clearInterval(this.autoUpdater[message.guild.id]);
      try {
        delete this.timerCount[message.guild.id];
        message.channel.send('update timer has been killed.');
      } catch (err) {
        log(err);
      }
      message.channel
        .send(
          "I can't find the last calendar I posted. Use `!L display` and I'll post a new one."
        )
        .then(() => {});
      return;
    }
    const messageId = calendar.calendarMessageId;
    message.channel.messages
      .fetch(messageId)
      .then((m) =>
        this.generateCalendar(message, dayMap).then((embed) => {
          if (embed === 2048) return;
          m.edit(embed);
          if (
            (this.timerCount[message.guild.id] === 0 ||
              !this.timerCount[message.guild.id]) &&
            human
          )
            this.startUpdateTimer(message);
        })
      )
      .catch((err) => {
        log(
          `error fetching previous calendar message in guild: ${message.guild.id}: ${err}`
        );
        try {
          clearInterval(this.autoUpdater[message.guild.id]);
          try {
            delete this.timerCount[message.guild.id];
            message.channel.send('update timer has been killed.');
          } catch (e) {
            log(e);
          }
        } catch (_err) {
          log(_err);
        }
        message.channel.send(
          "I can't find the last calendar I posted. Use `!L display` and I'll post a new one."
        );
        calendar.calendarMessageId = '';
        database.writeGuildSpecific(
          message.guild.id,
          calendar,
          'calendar.json'
        );
      });
  },

  deleteEventById(eventId, calendarId, dayMap, message) {
    return Events.delete(calendarId, eventId, {
      sendNotifications: true,
    })
      .then(() => {
        this.getEvents(message, calendarId, dayMap);
        setTimeout(() => this.updateCalendar(message, dayMap, true), 2000);
      })
      .catch((err) =>
        log(
          `function deleteEventById error in guild: ${message.guild.id}: ${err}`
        )
      );
  },

  listSingleEventsWithinDateRange(message, calendarId, dayMap) {
    const eventsArray = [];
    const params = {
      timeMin: dayMap[0].toISO(),
      timeMax: dayMap[6].toISO(),
      singleEvents: true,
      timeZone: dates.getValidTz(message.guild.id),
    };
    return Events.list(calendarId, params)
      .then((json) => {
        for (let i = 0; i < json.length; i++)
          eventsArray.push({
            id: json[i].id,
            summary: json[i].summary,
            location: json[i].location,
            start: json[i].start,
            end: json[i].end,
            status: json[i].status,
          });
        return eventsArray;
      })
      .catch((err) =>
        log('Error: listSingleEventsWithinDateRange', err.message)
      );
  },

  calendarUpdater(message, calendarId, dayMap, timer) {
    try {
      dayMap = this.createDayMap(message);
      setTimeout(() => this.getEvents(message, calendarId, dayMap), 2000);
      setTimeout(() => this.updateCalendar(message, dayMap, false), 4000);
    } catch (err) {
      log(`error in autoupdater in guild: ${message.guild.id}: ${err}`);
      clearInterval(this.autoUpdater[message.guild.id]);
      try {
        delete timer[message.guild.id];
      } catch (e) {
        log(e);
      }
    }
  },

  deleteUpdater(guildid) {
    clearInterval(this.autoUpdater[guildid]);
    try {
      delete this.timerCount[guildid];
    } catch (err) {
      log(err);
    }
  },

  delayGetEvents(message, calendarId, dayMap) {
    setTimeout(() => this.getEvents(message, calendarId, dayMap), 1000);
  },
};
