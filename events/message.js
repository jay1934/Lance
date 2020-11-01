module.exports = (message, { config: { prefix }, commands }) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = commands.find(({ match }) => match.test(commandName));

  if (!command) return;

  try {
    command.execute(message, message.client, args);
  } catch (e) {
    message.channel.send('Something went wrong');
    console.error(`Error while executing the ${command} command: ${e}`);
  }
};
