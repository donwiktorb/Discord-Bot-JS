
Functions.Add('channelCheck', async (msg) => {
    let antiSpamVerify = await Functions.Execute('antiSpamVerify', msg);
    let blacklist = await Functions.Execute('wordBlacklist', msg);
    if (!blacklist) {
        let proposition = await Functions.Execute('propositions', msg);
    }
    return antiSpamVerify;
});

Functions.Add('antiSpamVerify', (msg) => {
    let channel = msg.channel;
    if (channel.type == 'dm') return;
    let content = msg.content;
    let verify = Data.verify[msg.guild.id];
    channel = msg.channel.id;
    if (!verify || (verify && verify.channel != channel)) return false;
    
    if (!content.includes('verify')) {
        msg.delete(); 
        return true;
    }

    return false;
});

Functions.Add('wordBlacklist', async (msg) => {
    if (!msg) return false;
    let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');
    if (authorized) return false;
    let content = msg.content.toLowerCase();
    for (let word of Misc.blacklist) {
        if (content.includes(word.toLowerCase())) {
            let embed = Functions.Execute('createEmbed', msg, "BLACKLIST", TR(msg, "blacklistedword"));
            msg.author.send(embed);
            msg.delete();
            return true;
        }
    }
    return false;
});

Functions.Add('propositions', async (msg) => {
    if (!msg || msg.content.includes('verify')) return false;

    let authorized = await Functions.Execute('isAdmin', msg, 'ADMINISTRATOR');
    if (authorized) return false;

    let guild = msg.guild;

    let proposition = Data.proposition[guild.id];

    if (!proposition) return false;

    let channel = guild.channels.cache.get(proposition);

    if (!channel || msg.channel.id != channel) return false;

    let content = msg.content;
    let author = msg.author;

    let embed = Functions.Execute('createEmbed', msg, TR(msg, "proposition"), `${content} \n\n ${author} (${author.id})`);

    channel.send(embed).then(async newmsg => {
        await newmsg.react('✅');
        await newmsg.react('❌');
    });

    msg.delete();

    return true;

});