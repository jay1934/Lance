const { Client, Collection } = require('discord.js');

module.exports = class Lance extends Client {
  constructor(ClientOptions) {
    super(ClientOptions);
    Object.assign(this, {
      config: require('../config/settings.json'),
      commands: new Collection(),
      voices: new Collection(),
      messages: new Collection(),
      streams: new Collection(),
    });
  }
};
