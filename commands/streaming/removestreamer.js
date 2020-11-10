module.exports = {
  match: 'removestr(ea|i)mm?er',
  async execute(message, client, [id]) {
    let member;
    try {
      member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(id));
    } catch (e) {
      // member not found
    }

    if (!member)
      return message.channel.send(
        'Please provide a valid mention or user ID of the member. Make sure the member is actually in this guild. Note that anyone perviously on the streamer list that have left the guild have been automatically removed.'
      );

    const data = Object.entries(
      require('../../util/functions/database.js').readFile(
        './data/streamerDatabase.json'
      )
    );

    const streamer = data.findIndex(([, id]) => id === member.id);

    if (streamer < -1)
      return message.channel.send(
        'This member is not on the list of streamers!'
      );

    const [[name]] = data.splice(streamer, 1);
    require('fs').writeFileSync(
      './data/streamerDatabase.json',
      JSON.stringify(Object.fromEntries(data), '', 2)
    );

    message.channel.send(
      `${name} (${member.user.tag}) has been removed from the streamers list`
    );
    member.roles.remove(client.config.twitchAlerts.streamerRoleID);
    require('../../listen.js').restartListener(message.guild);
  },
};
