const ytdl = require('ytdl-core');

Functions.Add('join', (msg) => {
    if (msg.member.voice.channel.joinable)
        return msg.member.voice.channel.join()
    else
        return msg.reply("Can't join your channel")
});

Functions.Add('leave', (msg) => {
    let gid = msg.guild.id;
    let voiceChannel = msg.member.voice.channel;

    let connection = client.voice.connections.find(conn => conn.channel.guild.id == gid);
    if (connection && connection.channel.id == voiceChannel.id) {
        connection.disconnect()
        Functions.Execute('clearqueue', msg)
        return msg.reply("Disconnected")
    }
});

Functions.Add('play', async (msg, data) => {
    var voiceChannel = msg.member.voice.channel;

    var player = {}
    let gid = msg.guild.id;
    let item = 0
    if (!data.forced2 && queue[gid] != undefined && queue[gid].queue != undefined &&  queue[gid].queue[item] != undefined) {
        let link = queue[gid].queue[item].link
        let title = queue[gid].queue[item].title
        await Functions.Execute('removequeue', msg, item);

        if (queue[gid] == undefined || queue[gid].queue.length == 0)
            data = {"type":"link", "query":link, "title": title}
        else
            data = {"type":"link", "query":link, "title": title, "forced":true}

        msg.channel.send(`Playing ${title} (${link})`)
    }

    delete data.forced2;

    if (!data.forced) {
        if (data.type == 'playlist') {
            let reqLink = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${data.query}&key=AIzaSyC8IpPbtvZpBelxfdLXvOptyKpBa7NiJG8`
            let link = await Functions.Execute('createRequest', reqLink);
            let playlink = false;

            for (let item in link.items) {
                item = link.items[item]
                let videoId = item.snippet.resourceId.videoId
                let title = item.snippet.title
                let data = {"title": title, "link":`https://www.youtube.com/watch?v=${videoId}`}
                if (!playlink) {
                    player.link = `https://www.youtube.com/watch?v=${videoId}`
                    playlink = true;
                }else {
                    await Functions.Execute('addqueue', msg, data);
                }
            }
        }else if (data.type == 'name') {
            let reqLink = `https://www.googleapis.com/youtube/v3/search?q=${data.query}&part=snippet&regionCode=PL&relevanceLanguage=pl&type=video&key=AIzaSyC8IpPbtvZpBelxfdLXvOptyKpBa7NiJG8`
            let link = await Functions.Execute('createRequest', reqLink);
            if (link.items[0] && link.items[0].id && link.items[0].id.videoId)
                player.link = "https://www.youtube.com/watch?v="+link.items[0].id.videoId;
            else
                return msg.reply(TR(msg, "notfound"));
        } else {
            player.link = data.query;
        }
        msg.channel.send(TR(msg, "currentlyplaying", player.link))
    } else {
        player.link = data.query
    }

    let connection = client.voice.connections.find(conn => conn.channel.guild.id == gid);

    if (!voiceChannel)
    {
        if (connection) {
            connection.disconnect()
            Functions.Execute('clearqueue', msg)
            return msg.reply(TR(msg, "samechannel"))
        }
    }
    
    if (!voiceChannel.joinable) return msg.reply(TR(msg, "cantjoin"))

    if (connection) {
        if (connection.channel.id == voiceChannel.id) {
            let dispatcher = connection.play(ytdl(player.link, { filter: 'audioonly' }));

            dispatcher.on("finish", function() {
                Functions.Execute('play', msg, data)
            })
    
            dispatcher.on("error",error=>{
                Functions.Execute('skipqueue', msg)
                console.error("There was an error playing this music, skipping..."+error)
            });
        }

    } else {
        voiceChannel.join().then(connection => {
            let dispatcher = connection.play(ytdl(player.link, { filter: 'audioonly' }));
    
            dispatcher.on("finish", function() {
                Functions.Execute('play', msg, data)
            })
    
            dispatcher.on("error",error=>{
                Functions.Execute('skipqueue', msg)
                console.error("There was an error playing this music, skipping..."+error)
            });
        });
    }

});
