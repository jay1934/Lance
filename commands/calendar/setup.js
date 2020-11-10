module.exports = {
  match: '(setup|start|init)',
  unrestrict: true,
  execute: (message) => {
    message.channel.send(
      'Hi! Lets get me setup for use in this Discord. The steps are outlined below: \n' +
        `\n1. Invite \`${
          require('../../config/security/google.json').client_email
        }\` to 'Make changes to events' under the Permission Settings on the Google Calendar you want to use with Lance\n` +
        '2. Enter the Calendar ID of the calendar to Discord using the `!L id` command, i.e. `!L id 123abc@123abc.com`\n' +
        '3. Enter the timezone you want to use in Discord with the `!L tz` command, i.e. `!L tz America/New_York`, `!L tz UTC+4` or `!L tz EST` No spaces in formatting.\n' +
        '\n Lance should now be able to sync with your Google calendar and interact with on you on Discord, try `!L display` to get started!'
    );
  },
};
