module.exports = (client) => {
  const messages = new Map();

  client.on('message', (message) => {
    if (/^-(reactionroles?|rr)/i.test(message.content))
      require('./reactionrole.js')(message, messages);
  });

  client.on('messageDelete', ({ id }) => {
    if (messages.has(id)) messages.delete(id);
  });

  client.on('messageReactionAdd', async ({ message, emoji, users }, user) => {
    const role = (messages.get(message.id) || new Map()).get(
      emoji.id || emoji.name
    );
    if (user.id === user.client.user.id || !role) return;
    await users.remove(user);
    const { roles } = message.guild.member(user);
    (roles.cache.has(role) ? roles.remove(role) : roles.add(role)).catch(() => {
      if (
        message.channel.messages.cache.some(
          ({ author, content }) =>
            author.id === client.id &&
            content ===
              "That role is above mine in the role hierarchy, so I can't assign/unassign it to/from any member."
        )
      )
        return;
      message.channel
        .send(
          `That role is above mine in the role hierarchy, so I can't assign/unassign it to/from any member.`
        )
        .then((msg) => msg.delete({ timeout: 5000 }))
        .catch(() => {});
    });
  });

  client.on('messageReactionRemove', async ({ message, emoji }, { id }) => {
    const _message = messages.get(message.id);
    if (!_message || !_message.has(emoji.id || emoji.name)) return;
    if (id === client.user.id) _message.delete(emoji.id || emoji.name);
  });

  client.on('messageReactionRemoveAll', ({ id }) => {
    if (messages.has(id)) messages.get(id).clear();
  });
};
