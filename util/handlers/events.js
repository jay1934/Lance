const { readdirSync } = require('fs');

module.exports = (client) => {
  readdirSync('./events').forEach((file) =>
    client.on(file.split('.')[0], (...args) =>
      require(`../../events/${file}`)(...args, client)
    )
  );
};
