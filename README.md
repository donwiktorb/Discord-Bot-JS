### Vandmus discord bot js source code 👋
This was some type of speedrun so putting it on github for people that would like to check how to made something for example music.

### Need help or something?

➡️ [Join discord here](https://discord.gg/txsweyv)

### Links
- [Discord.js](https://discord.js.org/)
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static)
- [opusscript (i think it's this one)](https://github.com/abalabahaha/opusscript)
- [request](https://github.com/request/request)
- [ytdl-core](https://github.com/fent/node-ytdl-core)

### BOT SETUP
- Next you have to setup discord.js bot, download and install [Node js](https://nodejs.org/en/download/)
 - If you are using linux then you should follow these steps:
 - Nodejs
    - [Click here](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)
  - Installing bot
    - Create bot on [Discord Dev](https://discord.com/developers/applications) by creating new application (copy client id and save it for later) and clicking add bot, then copy the token
    - Edit data/config.js token with bot token
    - also edit commands/admin.js line 50 with your discord id if you want bladd command to work
    - Put all files in some directory ex. /home/bot/ then execute these in console like cmd or something
     ```
        cd BOT DIRECTORY /home/bot/ OR cd D:\bot for example.
        npm install
        node .
     ```
    - Invite bot to your discord by https://discord.com/oauth2/authorize?client_id=THEBOTCLIENTIDEDITTHIS&scope=bot&permissions=8

- How to make music working
- [Click here](https://console.developers.google.com/apis/enabled?hl=pl) and generate a key for youtube api
- Then change the line 43, 54, 60 with your youtube api key and you are done.

### Next
- Do what you want with it .

- Adding command example.
```
Commands.Add('test', async (msg, args) => {
    msg.reply("test");
});
```

- Adding function example.
```
Functions.Add('test', async (msg) => {
    return 'hi';
});
```

- Calling function 
```
Commands.Add('test', async (msg, args) => {
    let test = await Functions.Execute('test', msg);
    msg.reply(test);
});
```

- Create threads
```
Functions.CreateThread(48, async () => {
    // Request example
    let data = await Functions.Execute('createRequest', 'http://localhost:30120/players.json');
    if (!data)
        return client.user.setActivity("OFF")
    client.user.setActivity(`WL-OFF: ${data.length}`, { type: 'WATCHING' })
});
```