module.exports = ({ message, emoji }, { id }, { messages, user }) => {
  const _message = messages[message.id];
  if (!_message || !_message[emoji.id || emoji.name] || id !== user.id) return;
  delete _message[emoji.id || emoji.name];
  if (Object.values(_message).length === 1) delete messages[message.id];
  require('fs').writeFileSync(
    './data/reactionDatabase.json',
    JSON.stringify(messages, '', 2)
  );
};
