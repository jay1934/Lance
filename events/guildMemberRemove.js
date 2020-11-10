module.exports = (member) => {
  member.guild.channels.cache
    .get(member.client.config.memberLogging.departureChannelID)
    .send({
      embed: {
        thumbnail: {
          url: member.user.displayAvatarURL({ dynamic: true, size: 2048 }),
        },
        title: 'User Left',
        fields: [
          { name: 'User', value: `<@${member.id}>` },
          { name: 'Username', value: member.user.tag },
          { name: 'Nickname', value: member.nickname || 'N/A' },
          {
            name: 'Joined',
            value: `${require('moment')(member.joinedAt).format(
              'D MMM YYYY, h:mm a'
            )} (${Math.round(
              (Date.now() - member.joinedAt) / 86400000
            )} days ago)`,
          },
          {
            name: 'Created',
            value: require('moment')(member.user.createdAt).format(
              'D MMM YYYY, h:mm a'
            ),
          },
        ],
        color: 15158332,
        footer: {
          text: `ID: ${member.id}`,
        },
      },
    });

  const data = Object.entries(
    require('../util/functions/database.js').readFile(
      './data/streamerDatabase.json'
    )
  );

  const streamer = data.findIndex(([, id]) => id === member.id);

  if (streamer > -1) {
    data.splice(streamer, 1);
    require('fs').writeFileSync(
      './data/streamerDatabase.json',
      JSON.stringify(Object.fromEntries(data), '', 2)
    );
  }
};
