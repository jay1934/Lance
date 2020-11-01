

<div align="center">

![](https://media.discordapp.net/attachments/719694477027180544/771852466940805161/1604094355172.png)

## Reaction Roles Bot

[Installation](#Installation) • [How to use](#How-To-Use) • [Demo](#Full-Demo)

* * *


## Installation
</div>

##### Prerequisite

-   To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Reaction-Role-Bot/archive/main.zip)** the `zip` file.

2.  Configure the Bot:
    -   Run `npm i`
    -   You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
        - [**Make sure you enable the `GUILD_MEMBERS` intent**](https://media.discordapp.net/attachments/769862166131245066/771303808390266900/image0.png?width=1359&height=671)
    - Replace the placeholder "token" in [`index.js`](/index.js#L6) with your bot's token

3.  Invite the Bot to your Server:
    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2) 
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:  
       - `Send Messages`
       - `Embed Links`
       - `Add Reactions`
       - `View Message History`
       - `Manage Messages`
       - and `Manage Roles`
       
        If you'd like to be concise, or just `ADMINISTRATOR` if you don't care (there isn't much of a difference, although I think `ADMINISTRATOR` is easier since you don't have to manually give it access to every channel it needs)
    - Copy and paste the generated invite link!
    
    

3.  Get the Bot Online
    -   Run `node index.js`
    -   **The bot is now operational ! 🎉**

* * *

<div align="center"> 

## How to Use 

</div>

This bot only has one command, which can be triggered by any server admin with `-rr` or `-reactionroles` (case-insensitive). The bot assumes you have already sent the message that you want to set up reaction roles with.

<br>

A make-shift setup guide will then appear, prompting you to mention/provide the ID of the channel the message was sent in. The channel is required so that, just in case the message isn't cached, we can fetch it with Discord's API through the channel.

<br>

The next prompt will be to provide the ID/link to the message. Finally, the last step will be to react with all of your emojis, and then send a message mentioning/providing the IDs of all the corresponding roles **in the order that you mentioned them**

<br>

When making the original order, you pointed out that you would like the capability of reacting 20 emotes on a message for multiple messages. I assumed that you would be using reaction roles in quantities of ~20, so I made this method instead of the standard "on at a time" idea.

* * *
<div align="center"> 

## Full Demo

</div>

![](/demo.gif)

Disregard how long it takes for the emojis to unreact. That's not the code, it's just my wifi acting up 🤣
