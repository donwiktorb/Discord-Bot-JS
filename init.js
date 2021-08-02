
function Init() {
    var self = {}

    self.Core = function(data) {
        var discord = data.discord
        var client = data.client
        self.Discord = discord
        self.Client = client
        console.log("Inited as "+client.user.id + " "+client.user.tag)
    }

    return self
}

module.exports = Init();