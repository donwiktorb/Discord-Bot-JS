
Functions.Add('guildMemberAdd', async (member) => {
    let guild = member.guild;
    let data = Data.counter[guild.id];
    if (data) {
        let channel = data.channel;
        let content = data.content;
        let ch = await guild.channels.cache.get(channel);
        if (ch)
             ch.edit({name: SF(content, guild.memberCount)})

    }

    let channelId = Data.logs["memberjoined"] || Data.logs["deleted"][guild.id] || Data.logs["updated"][guild.id];
    let channel = await guild.channels.cache.get(channelId);
    let description = member.user.tag + " ["+ member.id+"] \n"+member.user.createdAt
    let embed = Functions.Execute('createEmbed', undefined, "MEMBER JOINED", description);
    if (channel) channel.send(embed);
});


Functions.Add('guildMemberRemove', async (member) => {
    let guild = member.guild;
    let data = Data.counter[guild.id];
    if (data) {
        let channel = data.channel;
        let content = data.content;
        let ch = await guild.channels.cache.get(channel);
        if (ch)
            ch.edit({name: SF(content, guild.memberCount)})
    }

    let channelId = Data.logs["memberleft"] || Data.logs["deleted"][guild.id] || Data.logs["updated"][guild.id];
    let channel = await guild.channels.cache.get(channelId);
    let description = member.user.tag + " ["+ member.id+"] \n"+member.user.createdAt
    let embed = Functions.Execute('createEmbed', undefined, "MEMBER LEFT", description);
    if (channel) channel.send(embed);
});