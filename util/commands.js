/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');

module.exports = (client) => {
  readdirSync('./commands').forEach((file) => {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  });
};
