module.exports = {
  match: '(display|show)(calendar)?',
  execute: async (message) => {
    const {
      calendars,
      database,
      general: { log },
    } = await require('../../util/handlers/functions.js');
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    const calendar = database.getGuildSettings(message.guild.id, 'calendar');
    const dayMap = calendars.createDayMap(message);
    calendars.delayGetEvents(message, settings.calendarID, dayMap);
    setTimeout(() => {
      try {
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
        calendars
          .generateCalendar(message, dayMap)
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
              setTimeout(() => calendars.startUpdateTimer(message), 2000);
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
    }, 2000);
  },
};
