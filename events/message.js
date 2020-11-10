module.exports = async (
  message,
  {
    config: {
      general: { prefix },
      reactionRoles: { requiredPermissions, requiredRoles },
    },
    commands,
  }
) => {
  const { database, general } = await require('../util/handlers/functions.js');

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commands.find((_, match) =>
    new RegExp(`^${match}$`).test(commandName)
  );

  if (!command) return;

  const err = (str) =>
    message.channel.send(str).then((msg) => msg.delete({ timeout: 5000 }));

  if (command.folder === 'calendar') {
    const settings = database.getGuildSettings(message.guild.id, 'settings');
    if (
      settings.allowedRoles.length &&
      !message.member.roles.cache.some((role) =>
        settings.allowedRoles.includes(role.name)
      )
    )
      return err('Insufficient Roles');

    if (
      !settings.allowedRoles.length &&
      !message.member.hasPermission('ADMINISTRATOR')
    )
      return err(
        "You must be an admin to use a calendar command. If you'd like to add an allowed role, please ask an admin to use `!L admin`"
      );

    if ((!settings.calendarID || !settings.timezone) && !command.unrestrict)
      return err(
        "You haven't finished setting me up! Please use the `!L setup` command to continue."
      );
  } else if (command.folder === 'reaction') {
    if (
      (requiredPermissions.length
        ? requiredPermissions.some(
            (perm) => !message.member.hasPermission(perm)
          )
        : false) ||
      (requiredRoles.length
        ? requiredRoles.some(
            (role) => !message.member.roles.some((r) => r.name === role)
          )
        : false)
    )
      return err('Insufficient roles or permissions.');
  }

  if (command.permission && !message.member.hasPermission(command.permissions))
    return err(
      `This command can only be used by someone with the \`${command.permission}\` permission.`
    );

  try {
    command.execute(message, message.client, args);
  } catch (e) {
    message.channel.send('Something went wrong');
    general.log(`Error while executing the ${commandName} command: ${e}`);
  }
};
