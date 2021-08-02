Functions.Add('msgReactionAdd', async (msg, emoji, user) => {
    var gid; 
    for (let item in Data.autorole) {
        let newitem = Data.autorole[item];
        if (newitem.guild == msg.guild.id && newitem.message == msg.id) gid = item;
    }

    let channel = msg.channel;
    let role = Data.autorole[gid];
    if (!role) return;
    if (!role.channel == channel.id) return;
    let save = role.save;

    role = role.reactions[emoji];
    if (!role) return;

    let uid = user.id;
    let member = msg.guild.members.cache.get(uid);
    if (!member) return;

    member.roles.add(role);
    member.send(TR(msg, "addedrole"));
    if (save) if (emoji == "🇵🇱") SLU(member.id, "pl"); else if (emoji == "🇬🇧") SLU(member.id, "en");


});

Functions.Add('msgReactionRemove', async (msg, emoji, user) => {
    var gid; 
    for (let item in Data.autorole) {
        let newitem = Data.autorole[item];
        if (newitem.guild == msg.guild.id && newitem.message == msg.id) gid = item;
    }

    let channel = msg.channel;
    let role = Data.autorole[gid];
    if (!role) return;
    if (!role.channel == channel.id) return;

    role = role.reactions[emoji];
    if (!role) return;

    let uid = user.id;
    let member = msg.guild.members.cache.get(uid);
    if (!member) return;

    member.roles.remove(role);
    member.send(TR(msg, "removedrole"));

});