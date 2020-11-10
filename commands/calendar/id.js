module.exports = {
  match: '(set)?(calendar)?id',
  unrestrict: true,
  execute: async (message, _, [calendarId]) => {
    const {
      database,
      general,
    } = await require('../../util/handlers/functions.js');
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    if (!calendarId && !settings.calendarID)
      return message.channel.send(
        'Enter a calendar ID using `!L id`, i.e. `!L id 123abc@123abc.com`'
      );

    if (!calendarId)
      return message.channel.send(
        `You didn't enter a calendar ID, you are currently using \`${settings.calendarID}\``
      );

    if (!message.content.includes('@'))
      return message.channel.send(
        "I don't think that's a valid calendar ID.. try again"
      );

    if (settings.calendarID !== '') {
      message.channel.send(
        `I've already been setup to use \`\`${settings.calendarID}\`\` as the calendar ID in this server, do you want to overwrite this and set the ID to \`${calendarId}\`? **(y/n)**`
      );
      general
        .yesThenCollector(message)
        .then(() => database.writeSetting(message, calendarId, 'calendarID'))
        .catch(general.log);
    } else {
      database.writeSetting(message, calendarId, 'calendarID');
    }
  },
};
