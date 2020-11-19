module.exports = async ({ message, emoji, users }, user, { messages }) => {
  const role = (messages[message.id] || {})[emoji.id || emoji.name];
  if (user.id === user.client.user.id || !role) return;
  await users.remove(user);
  const { roles } = message.guild.member(user);
  (roles.cache.has(role)
    ? roles.remove(role)
    : roles.add(role)
  ).catch(() => {});
  require('fs').writeFileSync(
    './data/reactionDatabase.json',
    JSON.stringify(messages, '', 2)
  );
};
