const { readdirSync } = require('fs');

module.exports = (client) => {
  readdirSync('./commands').forEach((folder) => {
    readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith('.js'))
      .forEach((file) => {
        const command = require(`../../commands/${folder}/${file}`);
        client.commands.set(command.match, { ...command, folder });
      });
  });
};
