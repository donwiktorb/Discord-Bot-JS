Functions.Add('discordLogs', async (type, ...args) => {
    if (type == 'messageDelete') {
        let msg = args[0];
        let content = msg.content;
        let author = msg.author;
        let guild = msg.guild;
        let msgChannel = msg.channel;
        let channelId = Data.logs["deleted"][guild.id];
        if (!channelId) return;
        let channel = guild.channels.cache.get(channelId);
        let description = "``"+content + "``\n" + author.tag + " ["+author.id+"] "+"\n"+ msgChannel.name + " ["+msgChannel.id+"]";
        let embed = Functions.Execute('createEmbed', msg, TR(msg, "msgdeleted"), description);
        channel.send(embed);
    }else if (type == 'messageUpdate') {
        let msg = args[0];
        let newmsg = args[1];
        let content = msg.content;
        let author = msg.author;
        let guild = msg.guild;
        let msgChannel = msg.channel;
        let channelId = Data.logs["updated"][guild.id] || Data.logs["deleted"][guild.id];
        if (!channelId) return;
        let channel = guild.channels.cache.get(channelId);
        let description = "OLD:\n``"+content + "``\nNEW:\n``"+ newmsg.content + "``\n" + author.tag + " ["+author.id+"] "+"\n"+ msgChannel.name + " ["+msgChannel.id+"]";
        let embed = Functions.Execute('createEmbed', msg, TR(msg, "msgupdated"), description);
        channel.send(embed);
    }else if (type == 'dm') {
        let msg = args[0];
        let content = msg.content;
        let author = msg.author;
        let channelId = Data.logs["dm"];
        if (!channelId) return;
        let channel = client.channels.cache.get(channelId);
        let description = "``"+content + "``\n" + author.tag + " ["+author.id+"] ";
        let embed = Functions.Execute('createEmbed', msg, "DM", description);
        channel.send(embed);
    }
});