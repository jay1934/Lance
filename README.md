<div align="center">

# 🅵🅾🆄🆁 🅱🅾🆃🆂 🅸🅽 🅾🅽🅴

Currently a merged version of three bots: a Reaction Role Bot, a Temporary Voice Channel Bot, Google Calendar Bot, and a Twitch Alerts Bot. Hopefully more to come!

[Installation](#Installation) • [Reaction Roles Bot](#Reaction-Roles-Bot) • [Voice Channels Bot](#Voice-Channels-Bot) • [Google Calendar Bot](#Google-Calendar-Bot) • [Twitch Alerts Bot](#Twitch-Alert-Bot)

## Installation

</div>

##### Prerequisite

- To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Lance/archive/lance.zip)** the `zip` file.

2.  Configure the Bot:

    - Run `npm i`
    - You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
      - [**Make sure you enable the `GUILD_MEMBERS` and `GUILD_PRESENCES` intent**](/assets/examples/intents.jpg)
    - Replace the placeholders in [`config/settings.json`](/config/settings.json) with your preferred settings, **along with your bot token**.

3.  Invite the Bot to your Server:

    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2)
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:

      - `ADMINISTRATOR`

      This will account for permissions needed on all three features.

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

This bot only has one command, which can be triggered by any server admin with `!L rr` or `!L reactionroles` (case-insensitive). The bot assumes you have already sent the message that you want to set up reaction roles with.

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

[How to use](#How-To-Use-1) • [Demo](#Full-Demo-1)

---

## How to Use

</div>

This bot's only feature is, when you join the channel specified in [`config/settings.json`](/config/settings.json#L25), it will immediately create a channel specifically for you, and automatically move you there.

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

<br>

---

---

<br>

<div align="center">

![](/assets/logos/calendarBanner.png)

## Google Calendar Bot

[How to use](#How-To-Use-2) • [Demo](#Full-Demo-2)

---

## How to Use

</div>

This bot is a compacted and modified version of the [Niles bot](https://github.com/niles-bot/Niles). In the interest of security, you'll have to create a Google Service Account to use the Google Calendar API, which I'll walk you through below:

<br>

1. Login to the [Google Cloud Console](https://console.cloud.google.com/)
2. On the top bar, tap "Select a Project" and then ["New Project"](/assets/examples/new_project.png). Name your project whatever you'd like.
3. On the top right you'll see "Creating \<name of project>...", and then "Select Project". Click that option.
4. Under the "APIs" section, click "APIs Overview"
5. On the top bar, click "Enable APIs and Services".
6. Search "Calendar", [click the Google Calendar API icon](/assets/examples/google-api), and then press "Enable"
7. Navigate back to the main dashboard of your project (not the "APIs and Services" dashboard)
8. On the left bar, hover over "IAM and Admin" and click ["Service Accounts"](/assets/examples/service_acc). Create a service account. (You can skip the optional steps)
9. Find the bar corresponding to your account, and click the three dots under the "Actions" tab.
10. Select ["Create Key"](/assets/examples/create_key) and choose the "JSON" option.
11. Replace the values in the [`config/security/google.json`](/config/security/google.json) with the values from your JSON.

<br>

Now you can [create a calendar](https://calendar.google.com/calendar/u/0/r/settings/createcalendar) (or use an existing one). In that calendar's settings, scroll down to **Share with specific people**, and add your service account's email (might look something like `service_acc_name@service_acc_id.iam.gserviceaccount.com`) with the permission "Make Changes to Events".

<br>

To copy the calendar's ID, scroll down to **Integrate Calendar** on the same settings page, and copy the unique ID. It should look something like `abc123@group.calendar.google.com`, or `<your_email>` if you're using the default calendar. Copy that ID, and paste it in the `!L id <calendar ID>` command.

<br>

You will also need to specify a timezone with the `!L tz` command, such as `!L tz America/New_York` or `!L tz UTC+4`. You're all set!

<br>

You can display your calendar with `!L display`, update it with `!L update`, create and delete events with `!L create <event details>` and `!L delete <event name>` respectively, change who can use calendar commands with `!L admin <role name>`, and change how the calendar is displayed with `!L diplayoptions <setting> <option>`.

<br>

The bot will automatically update the calendar at the interval specified in [`config/settings.json`](/config/settings.json#L30)

---

<div align="center">

## Full Demo

</div>

![](/assets/demos/calendarDemo.gif)

<br>

---

---

<br>

<div align="center">

![](/assets/logos/twitchBanner.png)

## Twitch Alert Bot

[How to use](#How-To-Use-3) • [Demo](#Full-Demo-3)

---

## How to Use

</div>

Again, in the interest of security, you'll have to create your own twitch application to use this bot. Luckily it's not as hard as creating a google service account.

<br>

1. Login to the [TDC (Twitch Developer Console)](https://dev.twitch.tv/console/apps) and click "Register Your Application"
2. Name the application, fill out the rest of the fields as shown in [this example](assets/examples/register_app.png), and press "create"
3. Then, on the bar corresponding to your newly made application, click "Manage"
4. At the bottom of the page, press "New Secret". Then copy and past your bot's secret and ID in [config/security/twitch.json](/config/security/twitch.json)

<br>

You can add streamers to the alert list with [`!L @mention <twitch-username>`](/commands/streaming/addstreamer.js), and remove them with [`!L removestreamer @mention`](/commands/streaming/removestreamer.js) (streamers will be removed from the list by default when they leave the server).

<br>

Alerts will appear in the channel specified in [`config/settings.json`](/config/settings.json#L15) a few minutes after any listen streamer starts streaming, and the [live role](/config/settings.json#L16) will be assigned until they stop streaming.

---

<div align="center">

## Full Demo

</div>

![](/assets/demos/twitchDemo.gif)

I skipped about a minute between starting the stream and the message appearing; there is inevitably a bit of a delay.
