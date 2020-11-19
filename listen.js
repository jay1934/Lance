const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');
const { WebHookListener, EnvPortAdapter, SimpleAdapter } = require('twitch-webhooks');
const { id, secret } = require('./config/security/twitch.json');
const { readFile } = require('./util/functions/database.js');

const authProvider = new ClientCredentialsAuthProvider(id, secret);
const apiClient = new ApiClient({ authProvider });
const listener = new WebHookListener(
  apiClient,
  new SimpleAdapter({
    hostName: require('./config/settings.json').technical.hostName,
    listenerPort: require('./config/settings.json').technical.listenerPort
  })
);

function subscribe(guild) {
  const {
    twitchAlerts: { streamAlertChannelID, liveRoleID },
  } = guild.client.config;
  const streamers = Object.entries(readFile('./data/streamerDatabase.json'));
  if (!streamers.length) return;
  streamers.forEach(async ([streamer, memberID]) => {
    const member = await guild.members.fetch(memberID);
    if (!member) return;
    const user = await apiClient.helix.users.getUserByName(streamer);
    let previous = await apiClient.helix.streams.getStreamByUserName(streamer);
    await listener.subscribeToStreamChanges(user, async (stream) => {
      if (stream) {
        if (!previous) {
          const game = await stream.getGame();
          guild.channels.cache
            .get(streamAlertChannelID)
            .send(
              `Hey everyone, ${member.displayName} is live on https://twitch.tv/${streamer} ! Go check it out!`,
              {
                embed: {
                  thumbnail: {
                    url: user.profilePictureUrl,
                  },
                  author: {
                    text: user.displayName,
                    iconURL: user.profilePictureUrl,
                  },
                  title: stream.title,
                  url: `https://twitch.tv/${streamer}`,
                  fields: [
                    { name: 'Game', value: game ? game.name : 'N/A' },
                    { name: 'Viewers', value: stream.viewers },
                  ],
                  image: {
                    url: stream.thumbnailUrl.replace(
                      '{width}x{height}',
                      '320x180'
                    ),
                  },
                  color: 9521150,
                },
              }
            );
          member.roles.add(liveRoleID);
        }
      } else member.roles.remove(liveRoleID);
      previous = stream;
    });
  });
}

module.exports = {
  async restartListener(guild) {
    await listener.unlisten().catch(() => {});
    await listener.listen();
    subscribe(guild);
  },

  client: apiClient,
};
