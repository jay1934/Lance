const guilds = require('../util/handlers/guilds.js');

module.exports = async (client) => {
  const {
    general: { log },
    database,
  } = await require('../util/handlers/functions.js');

  log(`Bot is logged in.`);
  const knownGuilds = Object.keys(database.getGuildDatabase());
  const unknownGuilds = client.guilds.cache
    .reduce((acc, guild) => [...acc, guild.id], [])
    .filter((x) => !knownGuilds.includes(x));
  unknownGuilds.forEach((guildId) => {
    log('unknown guild found; creating');
    guilds.create(client.guilds.cache.get(guildId));
  });
  require('../util/handlers/commands.js')(client);
  require('../listen.js').restartListener(client.guilds.cache.first());
};
