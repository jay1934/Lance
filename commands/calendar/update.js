module.exports = {
  match: 'update(calendar|events)?',
  execute: async (message) => {
    message.delete({ timeout: 5000 });

    const {
      general: { log },
      calendars,
      database,
    } = await require('../../util/handlers/functions.js');

    const { calendarID } = database.getGuildSettings(
      message.guild.id,
      'settings'
    );
    const calendar = database.getGuildSettings(message.guild.id, 'calendar');
    const dayMap = calendars.createDayMap(message);

    if (typeof calendar === 'undefined') {
      message.channel.send(
        'Cannot find calendar to update, maybe try a new calendar with `!L display`'
      );
      log(`calendar undefined in ${message.guild.id}. Killing update timer.`);
      clearInterval(calendars.autoUpdater[message.guild.id]);
      try {
        delete calendars.timerCount[message.guild.id];
        log('update timer has been killed.');
      } catch (err) {
        log(err);
      }
      return;
    }
    if (calendar.calendarMessageId === '')
      return message.channel.send(
        'Cannot find calendar to update, maybe try a new calendar with `!L display`'
      );
    calendars.delayGetEvents(message, calendarID, dayMap);
    setTimeout(() => {
      try {
        calendars.updateCalendar(message, dayMap, true);
      } catch (err) {
        log(`error in update command: ${err}`);
      }
    }, 2000);
  },
};
