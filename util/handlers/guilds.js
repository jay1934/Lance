const fs = require('fs');
const database = require('../functions/database.js');
const { log } = require('../functions/general.js');
const calendars = require('../functions/calendars.js');

module.exports = {
  create(guild) {
    const path = `./data/${guild.id}`;
    const d = new Date();
    const emptyCal = {
      day0: [],
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: [],
      lastUpdate: '',
      calendarMessageId: '',
    };
    const defaultSettings = {
      calendarID: '',
      calendarChannel: '',
      timezone: '',
      helpmenu: '1',
      format: 12,
      tzDisplay: '0',
      allowedRoles: [],
      emptydays: '1',
      trim: 0,
    };
    const guildData = {
      guildid: guild.id,
      name: guild.name,
      region: guild.region,
      ownerName: '',
      ownerId: guild.ownerID,
      timeAdded: d,
    };
    if (fs.existsSync(path)) log(`Guild ${guild.id} has come back online`);
    else if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      database.writeGuildSpecific(guild.id, emptyCal, 'calendar.json');
      database.writeGuildSpecific(guild.id, defaultSettings, 'settings.json');
      database.amendGuildDatabase({ [guild.id]: guildData });
      log(`Guild ${guild.id} has been created`);
    }
  },

  delete(guild) {
    const path = `./data/${guild.id}`;
    function deleteFolderRecursive(guildPath) {
      if (fs.existsSync(guildPath)) {
        fs.readdirSync(guildPath).forEach((file) => {
          const curPath = `${guildPath}/${file}`;
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(guildPath);
      }
    }
    deleteFolderRecursive(path);
    database.removeGuildFromDatabase(guild.id);
    calendars.deleteUpdater(guild.id);
    log(`Guild ${guild.id} has been deleted`);
  },
};
