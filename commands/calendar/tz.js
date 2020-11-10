module.exports = {
  match: 't(ime)?z(one)?',
  unrestrict: true,
  execute: async (message, _, [tz]) => {
    const {
      database,
      dates,
      general,
    } = await require('../../util/handlers/functions.js');

    const settings = database.getGuildSettings(message.guild.id, 'settings');
    const currentTz = settings.timezone;
    if (!tz) {
      if (!currentTz) {
        return message.channel.send(
          'Enter a timezone using `!L tz`, i.e. `!L tz America/New_York` or `!L tz UTC+4`. No spaces in formatting.'
        );
      }
      return message.channel.send(
        `You didn't enter a timezone, you are currently using \`${currentTz}\``
      );
    }
    if (dates.validateTz(tz)) {
      if (currentTz) {
        message.channel.send(
          `I've already been setup to use \`${currentTz}\`, do you want to overwrite this and use \`${tz}\`? **(y/n)** `
        );
        general
          .yesThenCollector(message)
          .then(() => database.writeSetting(message, tz, 'timezone'))
          .catch(general.log);
      } else database.writeSetting(message, tz, 'timezone');
    } else
      return message.channel.send(
        'Enter a timezone in valid format `!L tz`, i.e. `!L tz America/New_York` or `!L tz UTC+4` or `!L tz EST` No spaces in formatting.'
      );
  },
};
