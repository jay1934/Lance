const fs = require('fs');
const { log } = require('./general.js');

let guildDatabase;
module.exports = {
  readFile(path) {
    try {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
      log(`error reading file ${err}`);
      return {};
    }
  },

  writeSetting(message, value, setting) {
    const settings = this.getGuildSettings(message.guild.id, 'settings');
    settings[setting] = value;
    message.channel.send(
      `Okay, the value for this server's \`${setting}\` setting has been changed to \`${value}\``
    );
    this.writeGuildSpecific(message.guild.id, settings, 'settings.json');
  },

  getGuildSettings(id, file) {
    return this.readFile(`./data/${id}/${file}.json`);
  },

  getGuildDatabase() {
    guildDatabase = guildDatabase || this.readFile('./data/guildDatabase.json');
    return guildDatabase;
  },

  writeGuildDatabase() {
    return fs.writeFile(
      './data/guildDatabase.json',
      JSON.stringify(guildDatabase, '', '\t'),
      (err) => {
        if (!err) return;

        return log('[ERROR] while writing the guild database:', err);
      }
    );
  },

  amendGuildDatabase(partialGuildDb) {
    Object.assign(guildDatabase, partialGuildDb);
    this.writeGuildDatabase();
  },

  removeGuildFromDatabase(guildId) {
    delete guildDatabase[guildId];
    this.writeGuildDatabase();
  },

  writeGuildSpecific(guildid, json, file) {
    fs.writeFile(
      `./data/${guildid}/${file}`,
      JSON.stringify(json, '', '\t'),
      (err) => {
        if (err) return log(`error writing guild specific database: ${err}`);
      }
    );
  },
};
