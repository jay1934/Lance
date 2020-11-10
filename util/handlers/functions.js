module.exports = new Promise((resolve) => {
  require('fs').readdir('./util/functions', (_, files) => {
    resolve(
      files.reduce(
        (obj, file) => ({
          ...obj,
          [file.split('.')[0]]: require(`../functions/${file}`),
        }),
        {}
      )
    );
  });
});
