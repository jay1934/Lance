const { Client } = require('discord.js');

const client = new Client();
require('./events')(client);

client.login('token');
