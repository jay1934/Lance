<div align="center">

# 🆃🆆🅾 🅱🅾🆃🆂 🅸🅽 🅾🅽🅴

Currently a merged version of two bots: a Reaction Role Bot and a Temporary Voice Channel Bot. Hopefully more to come!

[Installation](#Installation) • [Reaction Roles](#Reaction-Roles-Bot) • [Voice Channels Bot](#Voice-Channels-Bot)

## Installation

</div>

##### Prerequisite

- To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Reaction-Role-Bot/archive/merged.zip)** the `zip` file.

2.  Configure the Bot:

    - Run `npm i`
    - You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
      - **Make sure you enable the `GUILD_MEMBERS` and `GUILD_PRESENCES` intent**
      ![](/assets/misc/intents.jpg)
    - Replace the placeholders in [`config.js`](/config.js) with your preffered settings, **along with your bot token**. This file acts as a JSON, only I'm able to add comments.

3.  Invite the Bot to your Server:

    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2)
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:

      - `ADMINISTRATOR`

      This will account for permissions needed on both features.

    - Copy and paste the generated invite link!

4.  Get the Bot Online
    - Run `node index.js`
    - **The bot is now operational ! 🎉**

<br>

---

---

<br>

![](/assets/logos/reactionsBanner.png)

<div align="center">

## Reaction Roles Bot

[How to use](#How-To-Use) • [Demo](#Full-Demo)

---

## How to Use

</div>

This bot only has one command, which can be triggered by any server admin with `-rr` or `-reactionroles` (case-insensitive). The bot assumes you have already sent the message that you want to set up reaction roles with.

<br>

A make-shift setup guide will then appear, prompting you to mention/provide the ID of the channel the message was sent in. The channel is required so that, just in case the message isn't cached, we can fetch it with Discord's API through the channel.

<br>

The next prompt will be to provide the ID/link to the message. Finally, the last step will be to react with all of your emojis, and then send a message mentioning/providing the IDs of all the corresponding roles **in the order that you mentioned them**

<br>

When making the original order, you pointed out that you would like the capability of reacting 20 emotes on a message for multiple messages. I assumed that you would be using reaction roles in quantities of ~20, so I made this method instead of the standard "on at a time" idea.

---

<div align="center">

## Full Demo

</div>

![](/assets/demos/reactionsDemo.gif)

Disregard how long it takes for the emojis to unreact. That's not the code, it's just my wifi acting up 🤣

<br>

---

---

<br>

<div align="center">

![](/assets/logos/channelsBanner.png)

## Voice Channels Bot

[How to use](#How-To-Use) • [Demo](#Full-Demo)

---

## How to Use

</div>

This bot's only feature is, when you join the channel specified in [`config.js`](/config.js), it will immediately create a channel specifically for you, and automatically move you there.

<br>

You will have all the permissions in this channel, such as to add other people, change the permissions, mute and move members, etc.

<br>

If the join back into the base voice channel while your channel is still available, it will simply move you back to that channel.

---

<div align="center">

## Full Demo

</div>

![](/assets/demos/channelsDemo.gif)

I set the delay before deletion to just five seconds for the purpose of the video.
