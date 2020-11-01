const Lance = require('./classes/Lance.js');

const client = new Lance(require('./config.js'));
require('./util/events.js')(client);
require('./util/commands.js')(client);

client.login(client.config.token);
