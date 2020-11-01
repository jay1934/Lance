module.exports = ({ id }, { messages }) => {
  if (messages.has(id)) messages.delete(id);
};
