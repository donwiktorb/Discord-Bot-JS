
Commands.Add('ping', async (msg) => {
    let embed = Functions.Execute('createEmbed', msg, TR(msg, 'ping'), TR(msg, 'ping'));
    let m = await msg.channel.send(embed);
    embed = Functions.Execute('createEmbed', msg, 'Pong', `${m.createdTimestamp - msg.createdTimestamp}ms. API = ${Math.round(client.ws.ping)}ms`);
    m.edit(embed);
});

Commands.Add('lang', async (msg, args) => {
    let lang = args[0];
    if (!lang) return;

    SLU(msg.author.id, lang);
    msg.reply(TR(msg, "languagechanged", lang))
});

Commands.Add('help', (msg) => {
    let cmds = Commands.GetCommandsNames();
    let embed = Functions.Execute('createEmbed', msg, TR(msg, 'help'), TR(msg, 'helpmsg'));
    let info = []
    for (let cmdName of cmds) {
        info.push({"name":cmdName, "value":TR(msg, cmdName), "inline":false});
    }
    embed.addFields(info);
    msg.reply(embed);
});

Commands.Add('warns', async (msg, args) => {
    let user = msg.author;
    
    if (args[0]) {
        let member = msg.mentions.members.first() || msg.guild.members.fetch(args[0]).catch(console.error);
        if (member) {
            let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

            if (authorized) user = member.user;
        }
    }
    
    if (!Warns[msg.guild.id] || !Warns[msg.guild.id][user.id]) return msg.reply(TR(msg, "nowarns"));

    let embed = Functions.Execute('createEmbed', msg, TR(msg, 'warns'), TR(msg, 'warnshistory'));

    let info = []
    let warn = Warns[msg.guild.id][user.id];
    let lastwarn = Functions.Execute('getDateFromTimestamp', warn.lastwarn);
    info.push({"name":TR(msg, "total"), "value":warn.total, "inline":false});
    info.push({"name":TR(msg, "lastwarn"), "value":lastwarn, "inline":false});
    let counter = 0
    for (let newwarn of warn.history) {
        counter +=1;
        let date = Functions.Execute('getDateFromTimestamp', newwarn.date);
        info.push({"name":"#"+counter, "value":SF("`{0}`\n**{1}**", date, newwarn.reason), "inline":false});
    }

    embed.addFields(info);

    msg.reply(embed);
});

Commands.Add('verify', (msg) => {
    let verify = Data.verify[msg.guild.id];
    let channel = msg.channel;
    if (!verify || (verify && verify.channel != channel )) return;
    
    let embed = Functions.Execute('createEmbed', msg, TR(msg, 'verify'), TR(msg, 'verifyHelp'));
    let member = msg.member;
    let author = msg.author;

    msg.delete();

    channel.send(embed).then(async message => {
        await message.react('✅');

        const filter = (reaction,user) => ['✅'].includes(reaction.emoji.name) && user.id === author.id && reaction.message.channel.id === verify.channel;
        
        message.awaitReactions(filter, {
            max: 1,
            time: 40000,
            errors: ['time']
        }).then(collected => {
            reaction = collected.first();
            member.roles.add(verify.role);
            embed = Functions.Execute('createEmbed', msg, TR(msg, 'verified'), TR(msg, 'verifiedMsg'));
            channel = msg.guild.channels.cache.get("820627505328160870");
            
            if (channel) {
                channel.permissionOverwrites.get(author.id).delete();
            }

            member.send(embed).catch(e => {
                console.error("Error while sending message\n"+ e);
            });
            message.delete();
        }).catch(e => {
            message.delete();
            console.error("Error while collecting reactions\n"+ e);
        });
    }).catch(e => {
        console.error("Error while creating message\n"+e);
    });

});