module.exports = {
  match: 'admin',
  unrestrict: true,
  execute: async (message, _, args) => {
    const {
      database,
      general,
    } = await require('../../util/handlers/functions.js');
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    const adminRole = args.join(' ');
    const userRoles = message.member.roles.cache.map((role) => role.name);
    if (!adminRole && !settings.allowedRoles.length)
      return message.channel.send(
        "You can restrict who can control Lance's Google Calendar commands. \n" +
          'Lance will only allow one role to be used, and it must have a unique name. \n' +
          'The person assigning the restriction must have the role being assigned. \n' +
          'i.e. Create a role called *Scheduler*, and then tell Lance to only allow people with that role using `!L admin Scheduler` (case sensitive)\n'
      );

    if (!adminRole)
      return message.channel.send(
        `The admin role for this discord is \`${settings.allowedRoles}\`. You can change this setting using \`!L admin <ROLE>\`, making sure to spell the role as you've created it. You must have this role to set it as the admin role.\n You can allow everyone to use Lance again by entering \`!L admin everyone\``
      );

    if (adminRole) {
      if (/everyone/i.test(adminRole)) {
        message.channel.send(
          'Do you want to allow everyone in this channel/server to use Lance? **(y/n)**'
        );
        general
          .yesThenCollector(message)
          .then(() => database.writeSetting(message, [], 'allowedRoles'))
          .catch(general.log);
      } else if (!userRoles.includes(adminRole))
        return message.channel.send(
          "You do not have the role you're trying to assign. Remember that adding Roles is case-sensitive"
        );
      else {
        message.channel.send(
          `Do you want to restrict the use of the calendar to people with the \`${adminRole}\`? **(y/n)**`
        );
        general
          .yesThenCollector(message)
          .then(() =>
            database.writeSetting(message, [adminRole], 'allowedRoles')
          )
          .catch(general.log);
      }
    }
  },
};
