const { Client, Collection } = require('discord.js');

module.exports = class Lance extends Client {
  constructor(ClientOptions) {
    super(ClientOptions);
    Object.assign(this, {
      config: require('../config/settings.json'),
      commands: new Collection(),
      voices: new Collection(),
      streams: new Collection(),
    });
  }

  get messages() {
    return JSON.parse(
      require('fs').readFileSync('./data/reactionDatabase.json')
    );
  }
};
