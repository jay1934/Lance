module.exports = {
  log(...logItems) {
    return console.log(`[${new Date().toUTCString()}] ${logItems.join(' ')}`);
  },

  yesThenCollector(message) {
    const p = require('promise-defer')();
    const collector = message.channel.createMessageCollector(
      (m) => message.author.id === m.author.id,
      {
        time: 30000,
      }
    );
    collector.on('collect', (m) => {
      if (['y', 'yes'].includes(m.content.toLowerCase())) {
        p.resolve();
      } else {
        message.channel.send("Okay, I won't do that");
        p.reject();
      }
      collector.stop();
    });
    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        return message.channel.send('Command response timeout');
      }
    });
    return p.promise;
  },
};
