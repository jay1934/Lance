const database = require('../../util/functions/database');

module.exports = {
  match: 'help',
  execute(message) {
    const isAdmin = (
      message.member ||
      message.client.guilds.cache.first().member(message.author)
    ).hasPermission('ADMINISTRATOR');
    const color = () => Math.floor(Math.random() * 16777215);
    message.author.send({
      embed: {
        title: 'Features of the Lance Bot',
        color: color(),
      },
    });
    message.author.send({
      embed: {
        color: color(),
        title: 'Reaction Roles',
        fields: isAdmin
          ? [
              {
                name: 'To setup reaction roles (admin only)',
                value:
                  'This bot only has one command, which can be triggered by any server admin with `!L rr` or `!L reactionroles` (case-insensitive). The bot assumes you have already sent the message that you want to set up reaction roles with.\n\n' +
                  "A make-shift setup guide will then appear, prompting you to mention/provide the ID of the channel the message was sent in. The channel is required so that, just in case the message isn't cached, we can fetch it with Discord's API through the channel.\n\n" +
                  'The next prompt will be to provide the ID/link to the message. Finally, the last step will be to react with all of your emojis, and then send a message mentioning/providing the IDs of all the corresponding roles **in the order that you mentioned them**\n\n',
              },
              {
                name: 'To use reaction roles',
                value:
                  'Using reaction roles is easy! Simply navigate to [#role-assignment](https://discordapp.com/channels/211914397424025601/619964259056484353) and react te one or multiple emojis you want the corresponding role for.',
              },
            ]
          : [
              {
                name: 'To use reaction roles',
                value:
                  'Using reaction roles is easy! Simply navigate to [#role-assignment](https://discordapp.com/channels/211914397424025601/619964259056484353) and react te one or multiple emojis you want the corresponding role for.',
              },
            ],
      },
    });
    const { allowedRoles } = database.getGuildSettings(
      (message.guild || message.client.guilds.cache.first()).id,
      'settings'
    );
    message.author.send({
      embed: {
        color: color(),
        title: 'Google Calendar Integration',
        fields: (
          allowedRoles[0]
            ? (
                message.member ||
                message.client.guilds.cache.first().member(message.author)
              ).roles.cache.some((r) => r.name === allowedRoles[0])
            : isAdmin
        )
          ? [
              {
                name: `Commands for your google calendar (${
                  allowedRoles[0]
                    ? `anyone with the ${allowedRoles[0]} role`
                    : 'admin only'
                })`,
                value:
                  '`!L admin <role name>` - restrict command usage to one role\n' +
                  '`!L create <event details>` - create calendar event\n' +
                  '`!L delete <event name>` - delete calendar event\n' +
                  '`!L display` - display calendar embed\n' +
                  '`!L displayoptions <option> <setting>` - Modify the way the calendar is displayed\n' +
                  '`!L id <id>` - set the calendar id you want Lance to track\n' +
                  '`!L setup` - recieve in-depth setup instructions\n' +
                  '`!L tz <timezone>` - set your timezone\n' +
                  '`!L update` - force update the calendar\n\n',
              },
              {
                name: 'How it works',
                value:
                  'Once an admin connects a corresponding calendar, Lance will create an embed visualizer you can check out in [#aegis_weekly_schedule](https://discordapp.com/channels/211914397424025601/668226243359145996). Admins can add and delete events using commands, and the calendar will auto update every 5 minutes!',
              },
            ]
          : [],
      },
    });
    message.author.send({
      embed: {
        color: color(),
        title: 'Streaming',
        fields: isAdmin
          ? [
              {
                name: 'Adding and removing streamers (admins only)',
                value:
                  'Admins can add and remove streamers using the `!L addstreamer @mention <twitch username>` and `!L removestreamer @mention` commands respectively (streamers are automatically removed when they leave the guild).\n\n',
              },
              {
                name: 'How it works',
                value:
                  'Within a few minutes of a stream starting, the streamer will be given the live role and an alert will be sent in [#streamers](https://discordapp.com/channels/211914397424025601/552977669474484280). After the stream has ended, the role will be taken away.',
              },
            ]
          : [
              {
                name: 'How it works',
                value:
                  'Within a few minutes of a stream starting, the streamer will be given the live role and an alert will be sent in [#streamers](https://discordapp.com/channels/211914397424025601/552977669474484280). After the stream has ended, the role will be taken away.',
              },
            ],
      },
    });
    message.author.send({
      embed: { color: color(), title: 'Hopefully more to come!' },
    });
  },
};
