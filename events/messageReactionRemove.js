module.exports = ({ message, emoji }, { id }, { messages, user }) => {
  const _message = messages.get(message.id);
  if (!_message || !_message.has(emoji.id || emoji.name)) return;
  if (id === user.id) _message.delete(emoji.id || emoji.name);
};
