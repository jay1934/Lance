const Lance = require('./classes/Lance.js');

const client = new Lance();
require('./util/handlers/events.js')(client);

client.login(client.config.general.token);
