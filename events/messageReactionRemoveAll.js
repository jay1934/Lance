module.exports = ({ id }, { messages }) => {
  if (!messages[id]) return;
  delete messages[id];
  require('fs').writeFileSync(
    './data/reactionDatabase.json',
    JSON.stringify(messages, '', 2)
  );
};
