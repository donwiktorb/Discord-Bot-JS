Commands.Add('clear', async (msg, args) => {
    Functions.Execute('clear', msg, args);
});

Commands.Add('kick', async (msg, args) => {
    Functions.Execute('kick', msg, args);
});

Commands.Add('ban', async (msg, args) => {
    Functions.Execute('ban', msg, args);
});

Commands.Add('unban', async (msg, args) => {
    Functions.Execute('unban', msg, args);
});

Commands.Add('say', async (msg, args) => {
    Functions.Execute('say', msg, args);
});

Commands.Add('mess', async (msg, args) => {
    Functions.Execute('mess', msg, args);
});

Commands.Add('setup', async (msg, args) => {
    Functions.Execute('setup', msg, args);
});

Commands.Add('mute', async (msg, args) => {
    Functions.Execute('mute', msg, args);

});

Commands.Add('unmute', async (msg, args) => {
    Functions.Execute('unmute', msg, args);

});

Commands.Add('warn', async (msg, args) => {
    Functions.Execute('warn', msg, args);

});

Commands.Add('clearwarns', async (msg, args) => {
    Functions.Execute('clearWarns', msg, args);

});

Commands.Add('bladd', async (msg, args) => {
    if (msg.author.id == 'CHANGE ME') {
        if (args[0]) {
            let content = args.join(' ');
            Misc.blacklist.push(content);

            require('fs').writeFile('./data/misc.json', 
            JSON.stringify(Misc, null , 4), 'utf8', () => {
                Misc = require("../data/misc.json");
                msg.reply(TR(msg, "done"))
            }
        );
        }

    }
});