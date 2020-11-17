const { Permissions } = require('discord.js');

module.exports = async (
  { channel: oldChannel },
  { guild, member, channel },
  {
    config: {
      voiceChannels: {
        channelID,
        categoryID,
        roleID,
	newChannelName: name,
        delayBeforeDeletion: delay,
      },
    },
    voices,
  }
) => {
  if (channel && channel.id === channelID) {
    const existing = voices.get(member.id);
    if (existing) member.voice.setChannel(existing);
    else
      guild.channels
        .create(
          name
            .replace(/{tag}/g, member.user.tag)
            .replace(/{user}/g, member.user.username),
          {
            type: 'voice',
            parent: categoryID,
            permissionOverwrites: [
              { id: guild.id, deny: ['VIEW_CHANNEL', 'CONNECT'] },
              { id: member.id, allow: Permissions.ALL },
	      { id: roleID, allow: ['VIEW_CHANNEL', 'CONNECT'] },
            ],
          }
        )
        .then((vc) => {
          member.voice.setChannel(vc);
          voices.set(member.id, vc.id);
        });
  } else if (
    oldChannel &&
    voices.some((id) => id === oldChannel.id) &&
    !oldChannel.members.size
  ) {
    setTimeout(() => {
      if (!oldChannel.deleted && !oldChannel.members.size) oldChannel.delete();
    }, delay);
  }
};
