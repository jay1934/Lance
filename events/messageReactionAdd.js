module.exports = async ({ message, emoji, users }, user, { messages, id }) => {
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
          author.id === id &&
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
};
