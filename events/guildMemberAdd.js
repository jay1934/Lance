module.exports = (member) => {
  member
    .send(
      member.client.config.memberLogging.welcomeMessage
        .replace('{mention}', `<@${member.id}>`)
        .replace('{username}', member.user.username)
        .replace('{tag}', member.user.tag)
    )
    .catch(() =>
      require('../util/functions/general.js').log(
        `${member.user.tag} could not be DMd`
      )
    );

  member.guild.channels.cache
    .get(member.client.config.memberLogging.arrivalChannelID)
    .send({
      embed: {
        thumbnail: {
          url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
        },
        title: 'User Joined',
        fields: [
          { name: 'User', value: `<@${member.id}>` },
          { name: 'Username', value: member.user.tag },
          {
            name: 'Created',
            value: require('moment')(member.user.createdAt).format(
              'D MMM YYYY, h:mm a'
            ),
          },
        ],
        color: 3066993,
        footer: {
          text: `ID: ${member.id}`,
        },
      },
    });
};
