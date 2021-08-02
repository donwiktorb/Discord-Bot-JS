//requirements
Discord = require('discord.js');
const config = require("./data/config.json");
const Init = require("./init.js");
client = new Discord.Client();
require("./common.js");

//client

//ready
client.on('ready', () => {
    console.log('ready')
    Init.Core({"discord":Discord, "client":client})
    Functions.Execute('init')
});

client.on("messageReactionAdd", async (msgReaction, user) => {
    if (user.bot) return;
    if(msgReaction.emoji.toString() == '✅') return;
    let msg = msgReaction.message;
    let emoji = msgReaction.emoji.toString();
    await Functions.Execute('msgReactionAdd', msg, emoji, user);
});

client.on("messageReactionRemove", async (msgReaction, user) => {
    if (user.bot) return;
    if(msgReaction.emoji.toString() == '✅') return;
    let msg = msgReaction.message;
    let emoji = msgReaction.emoji.toString();
    await Functions.Execute('msgReactionRemove', msg, emoji, user);
});

client.on("messageDelete", message =>{
    Functions.Execute('discordLogs', 'messageDelete', message);
});

client.on("messageUpdate", async (oldmessage, message) =>{
    await Functions.Execute('discordLogs', 'messageUpdate', oldmessage, message);
    await Functions.Execute('channelCheck', message);
});

client.on("guildMemberAdd", async member =>{
    await Functions.Execute('guildMemberAdd', member);
});

client.on("guildMemberRemove", async member =>{
    await Functions.Execute('guildMemberRemove', member);
});

//commands
client.on('message', async message => {
    if(message.author.bot) return;

    let msgCheck = false;
    if (message.channel.type != 'dm') {
        await Functions.Execute('channelCheck', message).then(response => {
            msgCheck = response;
        });
    }else {
        await Functions.Execute('discordLogs', 'dm', message);

    }

    if (msgCheck) return;
    
    var IsCommand = false;
    var newprefix;
    var content = message.content.toLowerCase();
    
    if (typeof Commands.prefix === 'object')
        for (let prfx of Commands.prefix) {
            if (content.startsWith(prfx)) {
                IsCommand = true;
                newprefix = prfx;
            }
        }
    else
        if (content.startsWith(Commands.prefix)) {
            IsCommand = true;
            newprefix = Commands.prefix;
        }

    if (newprefix) {
        let args = message.content.slice(newprefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
    
        if (IsCommand) {
            return Commands.Execute(command, message, args)
        }
    }

});

//errors
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

client.login(config.token)
