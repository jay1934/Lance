const twitch = require('../../listen.js');

module.exports = {
  match: 'addstr(ea|i)mm?er',
  async execute(message, client, [id, username]) {
    let member;
    try {
      member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(id));
    } catch (e) {
      // member not found
    }

    if (!id || !/^(<@!?\d{17,18}>|\d{17,18})$/.test(id) || !member)
      return message.channel.send(
        'Please mention or provide the user ID of the discord member.\nCorrect usage: `!L addstreamer <member mention or ID> <twitch username>`'
      );

    if (!username)
      return message.channel.send(
        "Please provide the user's twitch username\nCorrect usage: `!L addstreamer <member mention or ID> <twitch username>`"
      );

    const streamer = await twitch.client.helix.users.getUserByName(username);

    if (!streamer)
      return message.channel.send(
        "I could not find a streamer by that name! Make sure you are providing the **username** (the name that's used in the stream URLs), and not the **display name** (the one that's shown in chat)"
      );

    const data = require('../../util/functions/database').readFile(
      './data/streamerDatabase.json'
    );

    if (data[streamer.name])
      return message.channel.send('That user is already in the list!');

    require('fs').writeFileSync(
      './data/streamerDatabase.json',
      JSON.stringify({ ...data, [streamer.name]: member.id }, '', 2)
    );

    member.roles.add(client.config.twitchAlerts.streamerRoleID);
    twitch.restartListener(message.guild);
    message.channel.send(
      `${streamer.name} (${member.user.tag}) has been added to the list of streamers! You can use \`!L removestreamer <mention or ID>\` to remove them.`
    );
  },
};
