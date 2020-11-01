module.exports = ({ id }, { messages }) => {
  if (messages.has(id)) messages.get(id).clear();
};
