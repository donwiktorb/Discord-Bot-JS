function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

Commands.Add('cube', async (msg, args) => {
    let numb = getRandomInt(1, 6);
    let embed = Functions.Execute('createEmbed', msg, "Cube", numb);

    msg.reply(embed);
});

Commands.Add('calculate', async (msg, args) => {
    let type = args[1];
    if (type == '+') {
        msg.reply(Number(args[0]) + Number(args[2]));
    }else if (type == '-') {
        msg.reply(Number(args[0]) - Number(args[2]));
    }else if (type == '*') {
        msg.reply(Number(args[0]) * Number(args[2]));
    }else if (type == '/' || type == ':') {
        msg.reply(Number(args[0]) / Number(args[2]));
    }
});
