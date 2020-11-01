module.exports = async (message, map) => {
  const err = (str, embed, ms) =>
    message.channel.send(str).then((msg) => {
      msg.delete({ timeout: ms || 7000 });
      if (embed) embed.delete({ timeout: ms || 7000 });
    });

  message.delete();
  if (message.type === 'dm') return err('This can only be used in a DM!');
  if (!message.member.hasPermission('ADMINISTRATOR'))
    return err('This can only be used by an administrator!');

  const embed = await message.channel.send({
    embed: {
      author: {
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      },
      thumbnail: {
        url: 'https://emoji.gg/assets/emoji/6795_WizardWumpus.png',
      },
      title: 'Reaction Role Setup Wizard',
      fields: [
        {
          name: 'First Step',
          value:
            'Please mention or respond with the [channel ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) of the channel with the message you would like to set up reactions for.',
        },
      ],
      footer: {
        text:
          'If you have not sent the message already, please respond "cancel" and do so right now.',
      },
      color: 3066993,
    },
  });
  return message.channel
    .awaitMessages((m) => m.author.id === message.author.id, {
      max: 1,
      time: 60000,
      errors: ['time'],
    })
    .then((messages) => {
      const msg = messages.first();
      if (msg.content === 'cancel') return err('Wizard canceled.', embed);
      const channel =
        msg.mentions.channels.first() ||
        msg.guild.channels.cache.get(msg.content);
      if (!channel)
        return err(
          "You didn't mention a channel and/or the channel ID you provided was invalid! Wizard canceled.",
          embed
        );
      if (channel.type !== 'text')
        return err(
          'The channel ID you provided leads to a DM or voice channel! Wizard canceled.',
          embed
        );
      msg.delete();
      embed.edit({
        embed: {
          ...embed.embeds[0],
          fields: [
            {
              name: 'Second Step',
              value:
                'Please [link](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#:~:text=To%20get%20the%20Message%20Link,an%20option%20to%20Copy%20Link) or respond with the [message ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) of the message you would like to set up reactions for.',
            },
          ],
        },
      });
      return message.channel
        .awaitMessages((m) => m.author.id === message.author.id, {
          max: 1,
          time: 60000,
          errors: ['time'],
        })
        .then(async (_messages) => {
          const _content = _messages.first().content;
          if (_content === 'cancel') return err('Wizard canceled.', embed);
          let _message;
          try {
            _message = await channel.messages.fetch(
              _content.match(
                new RegExp(`/${message.guild.id}/${channel.id}/(\\d{18})`)
              )[1]
            );
          } catch (e) {
            try {
              _message = await channel.messages.fetch(_content);
              if (_message.channel.id !== channel.id) throw null;
            } catch (_e) {
              return err(
                'The message ID you provided was invalid/referenced a message not in the channel you specified earlier, and/or the message link you provided was invalid/referenced a message not in the channel you specified earlier. Wizard canceled.',
                embed
              );
            }
          }
          _messages.first().delete();
          await embed.edit({
            embed: {
              ...embed.embeds[0],
              image: {
                url:
                  'https://media.discordapp.net/attachments/719694477027180544/771522513364058162/unknown.png?width=621&height=672',
              },
              fields: [
                {
                  name: 'Last Step',
                  value:
                    "Please react to this message with every emoji you'd like to use for the reaction roles. **The emojis must be from this server**.\n\nThen, send a message mentioning (or sending the role IDs if you don't want to ping people) of every role you'd like to assign **in order of the emojis you reacted**. I will filter out any reactions not sent by the user who triggered this command.\n\n**I CANNOT ADD OR REMOVE ANY ROLES ABOVE MINE**\n\nFor example:",
                },
              ],
              footer: {
                text:
                  'You can remove a reaction role from a message at any time by manually removing my emoji reaction. If you have not made the roles or emojis yet, please reply "cancel" and do so now.',
              },
              color: 3066993,
            },
          });
          function collect() {
            return message.channel
              .awaitMessages((m) => m.author.id === message.author.id, {
                max: 1,
                time: 600000,
                errors: ['time'],
              })
              .then(async (__messages) => {
                const __content = __messages.first().content;
                if (__content === 'cancel')
                  return err('Wizard canceled.', embed);
                const emojis = embed.reactions.cache
                  .filter((reaction) =>
                     reaction.users.cache.has(message.author.id)
                  )
                  .reduce(
                    (acc, { emoji }) =>
                      acc.some((e) => e.identifier === emoji.identifier)
                        ? acc
                        : [...acc, emoji],
                    []
                  );

                if (!emojis.length) {
                  err(
                    'Please react to my last message, and *then* reply. This error might also be appearing because you reacted with emojis not in this guild. Try again or respond "cancel" to cancel the setup wizard.'
                  );
                  return collect();
                }
                const roles = (__content.match(/\d{18}(?=[^\d])/g) || [])
                  .reduce(
                    (a, c) =>
                      message.guild.roles.cache.has(c) ? [...a, c] : a,
                    []
                  )
                  .slice(0, emojis.length);
                if (!roles.length) {
                  err(
                    'Could not find any roles IDs or mentions in your message. Please try again or respond "cancel" to cancel the setup wizard'
                  );
                  return collect();
                }
                if (roles.length < emojis.length) {
                  err(
                    `${emojis.length} emojis were reacted, but only ${roles.length} role IDs/mentions were found in your message! Please try again or respond "cancel" to cancel the setup wizard.`
                  );
                  return collect();
                }
                if (
                  new Set([
                    ...emojis.map((emoji) => emoji.name),
                    ..._message.reactions.cache.map(({ emoji }) => emoji.name),
                  ]).size > 20
                ) {
                  err(
                    `It looks like there are already some reactions on the specified message that when added to the emojis you specified, will push the 20-emoji-per-message limit. Please remove some reactions from my last message or from the specified message and try again, or respond "cancel" to cancel the setup wizard.`
                  );
                  return collect();
                }
                if (emojis.some((e) => e.id && !e.guild)) {
                  err(
                    'I spotted one or more emojis that aren\'t in this server! Please try again or respond "cancel" to cancel the setup wizard.',
                    null,
                    10000
                  );
                  embed.reactions.removeAll();
                  return collect();
                }
                __messages.first().delete();
                roles.forEach((role, idx) => {
                  const _map = map.get(_message.id);
                  const emoji = emojis[idx].id || emojis[idx].name;
                  _map
                    ? _map.set(emoji, role)
                    : map.set(_message.id, new Map([[emoji, role]]));
                  _message.react(emoji);
                });
                await embed.reactions.removeAll();
                return embed
                  .edit({
                    embed: {
                      author: {
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL(),
                      },
                      title: "You're all set up!",
                      footer: {
                        name:
                          'You can remove a reaction role from a message at any time by manually removing my emoji reaction.',
                      },
                      color: 3066993,
                    },
                  })
                  .then((e) => e.delete({ timeout: 3000 }));
              })
              .catch((e) => 
                err(
                  "You didn't respond within 10 minutes! Wizard canceled.",
                  embed,
                  10000
                )
              );
          }
          return collect();
        })
        .catch(() =>
          err(
            "You didn't respond within one minute! Wizard canceled.",
            embed,
            10000
          )
        );
    })
    .catch(() =>
      err(
        "You didn't respond within one minute! Wizard canceled.",
        embed,
        10000
      )
    );
};
