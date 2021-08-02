const request = require('request');

Functions.Add('createRequest', (query) => {
    return new Promise(resolve => {
        request(query, async (error, response, body) => {
            if (error || error && response == undefined || response == undefined) {
                console.error(error, response)
                await resolve(false);

            }
                //throw "There was an error fetching info from website "+error+" "+response;
            
            if (body) await resolve(JSON.parse(body));
            else { 
                console.error("Page not found")
                await resolve(false); //throw "Page not found";
            }
        });
    });
});

Functions.Add('init', () => {
    for (let item in Data.autorole) {
        let gid = item;
        let newData = Data;
        item = newData.autorole[item];
        let guild = client.guilds.cache.get(item.guild);
        let channel = guild.channels.cache.get(item.channel);

        channel.messages.fetch(item.message)

    }

    for (let item in Data.verify) {
        let gid = item;
        let newData = Data
        item = newData.verify[item];
        let guild = client.guilds.cache.get(gid);
        let channel = guild.channels.cache.get(item.channel);
        
        
        let embed = Functions.Execute('createEmbed', undefined, item.content.title, item.content.desc);
        
        channel.messages.fetch(item.message).then(msg => { msg.delete() }).catch(console.error);

        channel.send(embed).then(msg =>{
            item.message = msg.id;

            require('fs').writeFile('./data/data.json', 
            JSON.stringify(newData, null , 4), 'utf8', () => {
                Data = require("../data/data.json");
            }
        );
        });



    }

});