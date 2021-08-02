const requireme = require("./data/commands.json");
const requireme2 = require("./data/functions.json");
TR = require("./translate.js").Translate;
SF = require("./translate.js").StringFormat;
SLG = require("./translate.js").SetLanguageGuild;
SLU = require("./translate.js").SetLanguageUser;

Commands = require("./commands.js");
Functions = require("./functions.js");
Data = require("./data/data.json");
Misc = require("./data/misc.json");
Warns = require("./data/warns.json");

for (let cmd of requireme) {
    try {
        require(`./commands/${cmd}.js`);
    } catch(e) {
        console.log(`Error loading ${cmd}.js in ./commands/ \n ${e}`)
    }
}


for (let cmd of requireme2) {
    try {
        require(`./functions/${cmd}.js`);
    } catch(e) {
        console.log(`Error loading ${cmd}.js in ./functions/ \n ${e}`)
    }
}

Commands.Set('prefix', ["v!", "!"])
