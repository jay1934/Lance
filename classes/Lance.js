const { Client, Collection } = require('discord.js');

module.exports = class Lance extends Client {
  /**
   * @typedef {object} Configuration
   * @property {string} categoryID
   * @property {string} channelID
   * @property {string} newChannelName
   * @property {number} delayBeforeDeletion
   * @property {prefix} string
   * @property {string} token
   */

  /**
   * @param {Configuration} Configuration
   * @param {import('discord.js').ClientOptions} ClientOptions
   */
  constructor(Configuration, ClientOptions) {
    super(ClientOptions);
    this._config = Configuration;
    this._commands = new Collection();
    this._voices = new Collection();
    this._messages = new Collection();
  }

  get config() {
    return this._config;
  }

  get commands() {
    return this._commands;
  }

  get voices() {
    return this._voices;
  }

  get messages() {
    return this._messages;
  }
};
