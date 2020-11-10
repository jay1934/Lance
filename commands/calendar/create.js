module.exports = {
  match: '(create(event)?|scrim)',
  execute: async (message, _, args) => {
    const {
      calendars,
      database,
      general: { log },
    } = await require('../../util/handlers/functions.js');

    const { calendarID } = database.getGuildSettings(
      message.guild.id,
      'settings'
    );

    const dayMap = calendars.createDayMap(message);
    const p = require('promise-defer')();
    if (!args.length)
      return message.channel.send(
        'You need to enter an argument for this command. i.e `!L scrim xeno thursday 8pm - 9pm`'
      );

    calendars.Events.quickAdd(calendarID, {
      text: args.join(' '),
    })
      .then((resp) => {
        message.channel.send(
          `Event \`${resp.summary}\` on \`${
            resp.start.dateTime || resp.start.date
          }\` has been created`
        );
        p.resolve(resp);
      })
      .catch((err) => {
        log(
          `function updateCalendar error in guild: ${message.guild.id}: ${err}`
        );
        p.reject(err);
      });
    p.promise
      .then(() => calendars.getEvents(message, calendarID, dayMap))
      .then(() =>
        setTimeout(() => calendars.updateCalendar(message, dayMap, true), 2000)
      )
      .catch((err) =>
        log(`error creating event in guild: ${message.guild.id}: ${err}`)
      );
  },
};
