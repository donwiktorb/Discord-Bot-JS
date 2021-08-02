
queue = require('../data/queue.json');

Functions.Add('clearglobalqueue', () => {
    let newcfg = {}
    
    require('fs').writeFile('./data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
            console.log("Queue cleared")
        }
    );
});

Functions.Execute('clearglobalqueue')

Functions.Add('addqueue', (msg, data) => {
    let gid = msg.guild.id;

    let newcfg = queue

    if (newcfg[gid] == undefined) {
        newcfg[gid] = {}
        newcfg[gid].message = msg
        newcfg[gid].queue = []
    }   

    let newdata = {"link": data.link, "title": data.title}
    newcfg[gid].current = newdata;

    newcfg[gid].queue.push(newdata)

    require('fs').writeFile('./data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
        }
    );
});

Functions.Add('addcustomqueue', async (msg, data) => {

    if (data.type == 'playlist') {
        let reqLink = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${data.query}&key=AIzaSyC8IpPbtvZpBelxfdLXvOptyKpBa7NiJG8`
        let link = await Functions.Execute('createRequest', reqLink);

        for (let item in link.items) {
            item = link.items[item]
            let videoId = item.snippet.resourceId.videoId
            let title = item.snippet.title
            let data = {"title": title, "link":`https://www.youtube.com/watch?v=${videoId}`}
            await Functions.Execute('addqueue', msg, data);
        }
    }else if (data.type == 'name') {
        let reqLink = `https://www.googleapis.com/youtube/v3/search?q=${data.query}&part=snippet&regionCode=PL&relevanceLanguage=pl&type=video&key=AIzaSyC8IpPbtvZpBelxfdLXvOptyKpBa7NiJG8`
        let link = await Functions.Execute('createRequest', reqLink);
        let newlink = "https://www.youtube.com/watch?v="+link.items[0].id.videoId;
        let title = link.items[0].snippet.title
        await Functions.Execute('addqueue', msg, {"link":newlink, "title":title});
    } else {
        let reqLink = `https://www.googleapis.com/youtube/v3/search?q=${data.query}&part=snippet&regionCode=PL&relevanceLanguage=pl&type=video&key=AIzaSyC8IpPbtvZpBelxfdLXvOptyKpBa7NiJG8`
        let link = await Functions.Execute('createRequest', reqLink);
        let newlink = "https://www.youtube.com/watch?v="+link.items[0].id.videoId;
        let title = link.items[0].snippet.title
        await Functions.Execute('addqueue', msg, {"link":newlink, "title":title});
    }

});

Functions.Add('skipqueue', (msg, args) => {
    let gid = msg.guild.id;
    if (queue[gid] == undefined || queue[gid].queue.length == 0)
        return msg.reply(TR(msg, "noqueue"))

    let newcfg = queue

    let link = newcfg[gid].queue[0].link
    let title = newcfg[gid].queue[0].title
    let message = newcfg[gid].message

    Functions.Execute('play', message, {"type":"link", "query":link, "forced":true})
    let newdata = {"link": link, "title": title}
    newcfg[gid].current = newdata;
    newcfg[gid].queue.shift();

    if (newcfg[gid].queue.length == 1) {
        delete newcfg[gid];
        require('fs').writeFile('../data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
        }
    );
    } else {
        require('fs').writeFile('../data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
        }
    );
    }
});

Functions.Add('showqueue', (msg) => {
    let gid = msg.guild.id;
    if (queue[gid] == undefined || queue[gid].queue.length == 0)
        return msg.reply(TR(msg, "noqueue"))
        
    let info = []
    let count = 0;
    for (let item of queue[msg.guild.id].queue) {
        count = count + 1;
        info.push({"name":"#"+count+" "+item.title, "value":item.link, "inline":false});
    }
    let embed = Functions.Execute('createEmbed', msg, TR(msg, 'queue')+" "+info.length, TR(msg, 'queue'));
    embed.addFields(info);
    return msg.reply(embed);
});

Functions.Add('clearqueue', (msg) => {
    let newcfg = queue
    
    delete newcfg[msg.guild.id];

    require('fs').writeFile('./data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
            msg.reply(TR(msg, "cleared"))
        }
    );
});

Functions.Add('removequeue', (msg, key) => {
    let gid = msg.guild.id;
    if (!queue[gid])
        return

    let newcfg = queue
    if (newcfg[gid].queue.length == 1) {
        delete newcfg[gid];
        require('fs').writeFile('../data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
        }
    );
    } else {
        let newdata = {"link": newcfg[gid].queue[0].link, "title": newcfg[gid].queue[0].title}
        newcfg[gid].current = newdata;
        newcfg[gid].queue.shift();
        require('fs').writeFile('../data/queue.json', 
        JSON.stringify(newcfg, null , 4), 'utf8', () => {
            queue = require("../data/queue.json");
        }
    );
    }


});