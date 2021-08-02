Functions.Add('createEmbed', (msg, title, description, data) => {
    const embed = new Discord.MessageEmbed()
        .setAuthor(title, 'https://cdn.discordapp.com/attachments/601873100522389524/733191571377225758/Vandmus_Studio_logo.png')
        .setColor('RANDOM')
        .setDescription(description)
        .setFooter('donwiktorb BoskieRP#8125', "https://cdn.discordapp.com/attachments/816409277283172374/833059487051939850/Pre-comp_3_2.gif");
    return embed;
});

// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
Functions.Add('getDateFromTimestamp', (timestamp) => {
    let unix_timestamp = timestamp;
    let date = new Date(unix_timestamp);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = SF("{0}/{1}/{2} - {3}:{4}:{5}", day, month, year, hours, minutes.substr(-2), seconds.substr(-2));
    return formattedTime;
});