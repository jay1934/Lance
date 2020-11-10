module.exports = {
  match: 'displayoptions?',
  execute: async (message, _, [keyword, spec]) => {
    const database = require('../../util/functions/database');
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    switch (keyword) {
      case 'help': {
        if (![0, 1].includes(+spec))
          return message.channel.send(
            'Please only use 0 or 1 for the calendar help menu options, (off or on)'
          );
        database.writeGuildSpecific(
          message.guild.id,
          ((settings.helpmenu = spec), settings),
          'settings.json'
        );
        return message.channel.send(
          `Okay, I've turned the calendar help menu o${+spec ? 'n' : 'ff'}`
        );
      }
      case 'pin': {
        if (![0, 1].includes(+spec))
          return message.channel.send(
            'Please only use 0 or 1 for the calendar help menu options, (off or on)'
          );
        database.writeGuildSpecific(
          message.guild.id,
          ((settings.pin = spec), settings),
          'settings.json'
        );
        return message.channel.send(
          `Okay, I've turned pinning o${+spec ? 'n' : 'ff'}`
        );
      }
      case 'format': {
        if (![12, 24].includes(+spec))
          return message.channel.send(
            'Please only use 12 or 24 for the clock display options'
          );
        database.writeGuildSpecific(
          message.guild.id,
          ((settings.format = +spec), settings),
          'settings.json'
        );
        return message.channel.send(`Set to ${+spec}-Hour clock format`);
      }
      case 'tzdisplay': {
        if (![0, 1].includes(+spec))
          return message.channel.send(
            'Please only use 0 or 1 for the calendar timzone display options, (off or on)'
          );
        database.writeGuildSpecific(
          message.guild.id,
          ((settings.tzDisplay = +spec), settings),
          'settings.json'
        );
        return message.channel.send(
          `Turned timezone display o${+spec ? 'n' : 'ff'}`
        );
      }
      case 'emptydays': {
        if (![0, 1].includes(+spec))
          return message.channel.send(
            'Please only use 0 or 1 for the calendar empty days display options, (off or on)'
          );

        database.writeGuildSpecific(
          message.guild.id,
          ((settings.emptydays = +spec), settings),
          'settings.json'
        );
        return message.channel.send(
          `Turned display of empty days on ${+spec ? 'n' : 'ff'}`
        );
      }
      case 'trim': {
        if (Number.isNaN(+spec))
          return message.channel.send(
            "Please provide a number to trim event titles. (0 = don't trim!)"
          );
        database.writeGuildSpecific(
          message.guild.id,
          ((settings.trim = +spec), settings),
          'settings.json'
        );
        return message.channel.send(
          `Changed trimming of event titles to ${spec}`
        );
      }
      default:
        return message.channel.send(`**displayoptions USAGE**\`\`\`
      COMMAND                       PARAMS      EFFECT
      ---------------------------------------------------------------------------
      !displayoptions help          (0|1)       hide/show help
      !displayoptions pin           (0|1)       pin calendar message
      !displayoptions format        (12|24)     12h or 24h clock display 
      !displayoptions tzdisplay     (0|1)       hide/show timezone
      !displayoptions emptydays     (0|1)       hide/show empty days
      !displayoptions trim          (n)         trim event names to n characters (0 = off)
      \`\`\`
      `);
    }
  },
};
