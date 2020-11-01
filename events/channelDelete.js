module.exports = (channel, { voices }) => {
  const user = voices.findKey((id) => id === channel.id);
  if (user) voices.delete(user);
};
