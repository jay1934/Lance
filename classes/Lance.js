const { Client, Collection } = require("discord.js");

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
    Object.assign(this, {
      config: Configuration,
      commands: new Collection(),
      voices: new Collection(),
      messages: new Collection(),
    });
  }
};
