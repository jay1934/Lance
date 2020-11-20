module.exports = ({ id }, { messages }) => {
  if (!messages[id]) return;
  delete messages[id];
  require('fs').writFileSync(
    './data/reactionDatabase.json',
    JSON.stringify(messages, '', 2)
  );
};
