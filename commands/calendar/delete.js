module.exports = {
  match: 'e?del(ete)?(event)?',
  execute: async (message, _, args) => {
    const {
      calendars,
      database,
      general: { log },
    } = await require('../../util/handlers/functions.js');

    const { calendarID } = database.getGuildSettings(
      message.guild.id,
      'settings'
    );
    const dayMap = calendars.createDayMap(message);
    const deleteMessages = [];
    if (!args.length)
      return message.channel
        .send(
          'You need to enter an argument for this command. i.e `!L scrim xeno thursday 8pm - 9pm`'
        )
        .then((m) => m.delete({ timeout: 5000 }));

    calendars
      .listSingleEventsWithinDateRange(message, calendarID, dayMap)
      .then((resp) => {
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].summary) {
            if (
              args.join(' ').toUpperCase().trim() ===
              resp[i].summary.toUpperCase().trim()
            ) {
              let promptDate;
              if (resp[i].start.dateTime) promptDate = resp[i].start.dateTime;
              else promptDate = resp[i].start.date;

              message.channel
                .send(
                  `Are you sure you want to delete the event **${resp[i].summary}** on ${promptDate}? **(y/n)**`
                )
                .then((res) => res.delete({ timeout: 10000 }));
              const collector = message.channel.createMessageCollector(
                (m) => message.author.id === m.author.id,
                {
                  time: 10000,
                }
              );
              collector.on('collect', (m) => {
                deleteMessages.push(m.id);
                if (/^y(es)?$/i.test(m.content))
                  calendars
                    .deleteEventById(resp[i].id, calendarID, dayMap, message)
                    .then(() =>
                      message.channel
                        .send(`Event **${resp[i].summary}** deleted`)
                        .then((res) => res.delete({ timeout: 10000 }))
                    );
                else
                  message.channel
                    .send("Okay, I won't do that")
                    .then((res) => res.delete({ timeout: 5000 }));

                for (let k = 0; k < deleteMessages.length; k++)
                  message.channel.messages
                    .fetch(deleteMessages[k])
                    .then((msg) => msg.delete({ timeout: 5000 }));

                return collector.stop();
              });
              collector.on('end', (collected, reason) => {
                if (reason === 'time')
                  message.channel
                    .send('command response timeout')
                    .then((res) => res.delete({ timeout: 5000 }));
              });
              return;
            }
          }
        }
        return message.channel
          .send(
            "Couldn't find event with that name - make sure you use exactly what the event is named!"
          )
          .then((res) => res.delete({ timeout: 5000 }));
      })
      .catch((err) => {
        log(err);
        return message.channel
          .send('There was an error finding this event')
          .then((res) => res.delete({ timeout: 5000 }));
      });
  },
};
