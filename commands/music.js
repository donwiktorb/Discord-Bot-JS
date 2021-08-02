
Commands.Add('join', (msg) => {
    Functions.Execute('join', msg)
});

Commands.Add('leave', (msg) => {
    Functions.Execute('leave', msg)
});

Commands.Add('queue', (msg, args) => {
    if (!args[0])
        return Functions.Execute('showqueue', msg)
    else if (args[0] == 'clear')
        return Functions.Execute('clearqueue', msg)
    else {
        if (!args[0].includes('https://www.youtube'))
            data = {"type":"name", "query":args.join(" ")}
        else if (args[0].includes('&list=')){
            let newargs = args[0].split("&")
            let listid = newargs[1].slice('list'.length)
            for (let arg of newargs) {
                if (arg.includes('list')) {
                    listid = arg.slice('list='.length)
                }
            }
            if (!listid)
                return msg.reply(TR(msg, "nolist"))
            
            data = {"type":"playlist", "query":listid}
        }else data = {"type":"link", "query":args[0]}
        Functions.Execute('addcustomqueue', msg, data)
    }
    
});

Commands.Add('skip', (msg, args) => {
    return Functions.Execute('skipqueue', msg, args)
});

Commands.Add('play', (msg, args) => {
    if (!args[0]) {
        if (!queue[msg.guild.id] || !queue[msg.guild.id].current)
            return msg.reply(TR(msg, "nocurrent"));
        
        let current = queue[msg.guild.id].current
        return msg.reply(TR(msg, "current")+ "\n" +current.title + "\n"+current.link)

    }

    if (!msg.member.voice.channel)
        return msg.reply(TR(msg, ))

    if (!args[0].includes('https://www.youtube'))
        data = {"type":"name", "query":args.join(" ")}
    else if (args[0].includes('&list=')){
        let newargs = args[0].split("&")
        let listid = newargs[1].slice('list'.length)
        for (let arg of newargs) {
            if (arg.includes('list')) {
                listid = arg.slice('list='.length)
            }
        }
        if (!listid)
            return msg.reply(TR(msg, "nolist"))
        
        data = {"type":"playlist", "query":listid}
    }else data = {"type":"link", "query":args[0]}
    data.forced2 = true;
    Functions.Execute('play', msg, data)
});