module.exports = (client) =>
  Object.entries(client.messages).forEach(async ([id, { channel }]) =>
    client.channels.cache.get(channel).messages.fetch(id)
  );
