
Functions.CreateThread(48, async () => {
    let data = await Functions.Execute('createRequest', 'http://localhost:30120/players.json');
    if (!data)
        return client.user.setActivity("OFF")
    client.user.setActivity(`WL-OFF: ${data.length}`, { type: 'WATCHING' })
});
