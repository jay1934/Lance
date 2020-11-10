const { DateTime, IANAZone, FixedOffsetZone } = require('luxon');
const database = require('./database.js');

module.exports = {
  validateTz(tz) {
    return (
      IANAZone.isValidZone(tz) ||
      (FixedOffsetZone.parseSpecifier(tz) !== null &&
        FixedOffsetZone.parseSpecifier(tz).isValid)
    );
  },

  getValidTz(id) {
    const settings = database.getGuildSettings(id, 'settings');
    return this.validateTz(settings.timezone) ? settings.timezone : 'UTC';
  },

  getStringTime(date, guildid) {
    const { format } = database.getGuildSettings(guildid, 'settings');
    const zDate = DateTime.fromISO(date, { setZone: true });
    return zDate.toLocaleString({
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === 12,
    });
  },

  isNoMatch(checkDate, eventStartDate, eventEndDate) {
    return (
      (checkDate.hasSame(eventStartDate, 'day') &&
        eventStartDate.hasSame(eventEndDate, 'day')) ||
      (!eventStartDate.hasSame(eventEndDate, 'day') &&
        (checkDate.hasSame(eventStartDate, 'day') ||
          checkDate.hasSame(eventEndDate, 'day') ||
          (checkDate.startOf('day') > eventStartDate.startOf('day') &&
            checkDate.startOf('day') < eventEndDate.startOf('day'))))
    );
  },

  getWeek(date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  },
};
