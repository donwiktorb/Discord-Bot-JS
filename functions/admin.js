
Functions.Add('isAdmin', async (msg, permission) => {
    let author = msg.author
    let member = msg.member
    if (!member || !author)
        return false
    
    if (permission != undefined)
        if(member.permissions.has(permission, true))
            return true
    else
        if(member.permissions.has('ADMINISTRATOR', true))
            return true
    

    return false
});

Functions.Add('clear', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');
    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let count = parseInt(args[0], 10);

    if (!count || count < 2 || count > 100) return msg.reply(TR(msg, "clearcount"));

    let channel = msg.channel;
    let fetched = await channel.messages.fetch({limit: count});

    await channel.bulkDelete(fetched).catch(e => {
        msg.reply(TR(msg, "faileddelete", e));
    });

    msg.reply(TR(msg, "deleted", fetched.size)).then(newmsg => {
        newmsg.delete({timeout: 4000});
    });

});

Functions.Add('say', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let channel = msg.channel;

    let embed = Functions.Execute('createEmbed', undefined, `${msg.author.tag}`, args.join(' '));
    
    await channel.send(embed);
    msg.delete();
});

Functions.Add('kick', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'KICK_MEMBERS');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);
    
    if (!member) return msg.reply(TR(msg, "membernotfound"));
    if (!member.kickable) return msg.reply(TR(msg, "membernotkickable"));

    let reason = args.slice(1).join(' ');

    if (!reason) reason = TR(msg, "noreason");


    reason = reason + '\n'+TR(msg, "bybot") + ' \n ' + msg.author.tag + ' ' + msg.author.id;

    member.send(TR(msg, "kicked", msg.author.tag, msg.author.id, reason)).catch(console.error);
    await member.kick(reason).then(res => {
        let embed = Functions.Execute('createEmbed', msg, "KICK", TR(msg, "kickedmember", member.user.tag, member.user.id, reason));
        msg.reply(embed);
    }).catch(e => {
        msg.reply(TR(msg, "errorkicking", e));
    });
    
});

Functions.Add('mess', async (msg, args) => {
    if (msg.guild.id != '615129009679892483')
        return
    let authorized = await Functions.Execute('isAdmin', msg, 'BAN_MEMBERS');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));


    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]);

    args.shift();

    let content = args.join(' ');

    member.send(content + "\nWiadomość od <@!"+msg.author.id+">");
    
});

Functions.Add('warn', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));


    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);

    args.shift();

    let reason = args.join(' ');
    reason = reason + "\n"+ TR(msg, "bybot") + "\n" + TR(msg, "doneby", msg.author.tag, msg.author.id);

    let timestamp = Date.now();

    let author = msg.author;
    let user = member.user;
    let guild = msg.guild;

    if (!Warns[guild.id]) Warns[guild.id] = {};

    if (!Warns[guild.id][user.id]) {
        Warns[guild.id] = {
                [user.id]: {
                "total": 1,
                "lastwarn": timestamp,
                "history": [
                    {
                        "date": timestamp,
                        "reason": reason
                    }
                ]
            }
        }
    } else {
        let warn = Warns[guild.id][user.id];
        let total = warn.total + 1;
        let lastwarn = timestamp;
        let history = {
            "date": timestamp,
            "reason": reason
        }
 
        Warns[guild.id][user.id]["total"] = total;
        Warns[guild.id][user.id]["lastwarn"] = lastwarn;
        Warns[guild.id][user.id]["history"].push(history);
    }

    require('fs').writeFile('./data/warns.json', 
        JSON.stringify(Warns, null , 4), 'utf8', () => {
            Warns = require("../data/warns.json");
        }
    );
    msg.reply(TR(msg, "warned", member.user.tag, member.user.id, reason));
    
});

Functions.Add('clearWarns', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));


    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);

    args.shift();

    let reason = args.join(' ');

    let timestamp = Date.now();

    let user = member.user;

    let author = msg.author;
    let guild = msg.guild;
    if (!Warns[guild.id] || !Warns[guild.id][user.id]) return;

    delete Warns[guild.id][user.id];

    require('fs').writeFile('./data/warns.json', 
        JSON.stringify(Warns, null , 4), 'utf8', () => {
            Warns = require("../data/warns.json");
        }
    );
    msg.reply(TR(msg, "clearedwarns", member.user.tag, member.user.id));

});

Functions.Add('mute', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);
    
    if (!member) return msg.reply(TR(msg, "membernotfound"));
    if (!member.kickable || !member.bannable) return msg.reply(TR(msg, "membernotbanable"));

    args.shift();
    let time = args[0];
    if (!time) return;

    let cleantime = time;
    if (time.includes('d')) {
        time = Number(time.replace('d', ''))*24*60*60*1000;
    }
    else if (time.includes('h')) {
        time = Number(time.replace('h', ''))*3600000;
    }
    else if (time.includes('m')) {
        time = Number(time.replace('m', ''))*60000;
    }
    else return;

    args.shift();
    let reason = args.join(' ');

    if (!reason) reason = TR(msg, "noreason");

    reason = reason + '\n'+TR(msg, "bybot") + ' \n ' + msg.author.tag + ' ' + msg.author.id;

    msg.reply(TR(msg, "muted", member.user.tag, member.user.id, cleantime, time/1000, reason))

    for (let [id, channel] of msg.guild.channels.cache) {
        channel.createOverwrite(member.user, {
            SEND_MESSAGES: false
        });

    }

    setTimeout(()=>{
        for (let [id, channel] of msg.guild.channels.cache) {
            let permission = channel.permissionOverwrites.get(member.user.id);
            if (permission) permission.delete();
        }
        msg.channel.send(TR(msg, "unmuted", member.user.tag, member.user.id));
    },time);

});

Functions.Add('unmute', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'MANAGE_MESSAGES');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);
    
    if (!member) return msg.reply(TR(msg, "membernotfound"));
    if (!member.kickable || !member.bannable) return msg.reply(TR(msg, "membernotbanable"));


    for (let [id, channel] of msg.guild.channels.cache) {
        let permission = channel.permissionOverwrites.get(member.user.id);
        if (permission) permission.delete();

    }

});

Functions.Add('ban', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'BAN_MEMBERS');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]).catch(console.error);

    // console.log(member)
    
    if (!member) return msg.reply(TR(msg, "membernotfound"));
    if (!member.bannable) return msg.reply(TR(msg, "membernotbanable"));

    let reason = args.slice(1).join(' ');

    if (!reason) reason = TR(msg, "noreason");

    reason = reason + '\n'+TR(msg, "bannedbybot")  + ' \n ' + msg.author.tag + ' ' + msg.author.id;

    member.send(TR(msg, "bannedmember", msg.author, msg.author.id, reason)).catch(console.error);

    await member.ban({days: 7, reason:reason}).then(res => {
        let embed = Functions.Execute('createEmbed', msg, "BAN", TR(msg, "banned", member.user.tag, member.id, reason));
        msg.reply(embed);
    }).catch(e => {
        msg.reply(TR(msg, "errorbanning", e));
    });
    
});

Functions.Add('setup', async (msg, args) => {
    let type = args[0];
    args.shift();
    if (type == 'verify') {
        let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');

        if (!authorized) return msg.reply(TR(msg, "nopermission"));
    
        let channel = msg.mentions.channels.first() || await msg.guild.channels.fetch(args[0]).catch(console.error);
        let role = msg.mentions.roles.first() || await msg.guild.roles.fetch(args[1]).catch(console.error);
    
        if (!channel) return msg.reply(TR(msg, "channelnotfound"));
        if (!role) return msg.reply(TR(msg, "rolenotfound"));
    
    
        args.shift();
        args.shift();
        let title = args[0];
        title = SF(title, "\n");
        args.shift();
        let description = args.join(' ');
        description = SF(description, "\n");
        let guild = msg.guild;
    
        if (!title || !description) return msg.reply(TR(msg, "notitleordescription"));
        
        let embed = Functions.Execute('createEmbed', msg, title, description);
    
        await channel.send(embed).then(message => {
            Data.verify[guild.id] = {
                "channel": channel.id,
                "role": role.id,
                "content": {
                    "title": title,
                    "desc": description
                },
                "message": message.id
            }
            
            require('fs').writeFile('./data/data.json', 
                JSON.stringify(Data, null , 4), 'utf8', () => {
                    Data = require("../data/data.json");
                }
            );
        })
    } else if (type == 'counter') { 
        let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');

        if (!authorized) return msg.reply(TR(msg, "nopermission"));

        let cleancontent = args.join(' ');
        let guild = msg.guild;
        let edited = Data.counter[guild.id];
        if (edited) { 
            let ch = guild.channels.cache.get(edited.channel);
            if (ch)
                ch.delete();
        }
        content = SF(cleancontent, guild.memberCount);
        guild.channels.create(content, { type: 'voice', reason: TR(msg, "bybot")}).then(channel => {
            Data.counter[guild.id] = {
                "channel": channel.id,
                "content": cleancontent
            };
            require('fs').writeFile('./data/data.json', 
                JSON.stringify(Data, null , 4), 'utf8', () => {
                    Data = require("../data/data.json");
                }
            );
        });
    } else if (type == 'lang') {
        let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');

        if (!authorized) return msg.reply(TR(msg, "nopermission"));

        let lang = args[0];
        if (!lang) return;
        SLG(msg.guild.id, lang);
        msg.reply(TR(msg, "languagechanged", lang))
    
    } else if (type == 'proposition') {
        let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');

        if (!authorized) return msg.reply(TR(msg, "nopermission"));
    
        let channel = msg.mentions.channels.first() || await msg.guild.channels.fetch(args[0]).catch(console.error);
    
        if (!channel) return msg.reply(TR(msg, "channelnotfound"));
    
        Data.proposition[msg.guild.id] = channel.id;

        require('fs').writeFile('./data/data.json', 
            JSON.stringify(Data, null , 4), 'utf8', () => {
                Data = require("../data/data.json");
            }
        );
        
        msg.reply(TR(msg, "done"));
    }
});

Functions.Add('unban', async (msg, args) => {
    let authorized = await Functions.Execute('isAdmin', msg, 'BAN_MEMBERS');

    if (!authorized) return msg.reply(TR(msg, "nopermission"));

    let member = msg.mentions.members.first() || args[0];
    
    if (!member) return msg.reply(TR(msg, "membernotfound"));

    await msg.guild.members.unban(member).then(user => {
        let embed = Functions.Execute('createEmbed', msg, "UNBAN", TR(msg, "unbanned", user.tag, user.id));
        msg.reply(embed);
    }).catch(e => {
        msg.reply(TR(msg, "errorunbanning", e));
    });
    
});