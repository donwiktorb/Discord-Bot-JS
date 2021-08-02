function Translate() {
    // https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    if (!String.prototype.format) {
        String.prototype.format = function() {
          var args = arguments;
          if (typeof args[0] != 'string') {
            let oldargs = args[0];
            arguments = {}
            for (let index in oldargs) {
              let arg = oldargs[index];
              arguments[index] = arg;
            }
            args = arguments;
          }
          return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
          });
        };
    }

    this.Languages = require("./data/language.json");
    this.LanguagesAvailable = require("./data/languages.json");
    this.LanguagesChosen = require("./data/langchosen.json");
    this.LanguagesChosenGuild = require("./data/languagechosenguild.json");

    this.Translate = function(msg, str, ...args) {
        let authorId = msg.author.id;
        let gid = msg.guild.id;
        let lang = this.LanguagesChosen[authorId] || this.LanguagesChosenGuild[gid] || 'en'

        let text = this.Languages[lang][str] || false 

        if (!text) return "Translation for ``"+str+"`` does not exist."

        
        text = text.format(args);

        return text;

    }

    this.SetLanguageUser = function(key, val) {
        if (!this.LanguagesAvailable[val]) return "notavailable";

        this.LanguagesChosen[key] = val;
        require('fs').writeFile("./data/langchosen.json", 
        JSON.stringify(this.LanguagesChosen, null , 4), 'utf8', () => {
          this.LanguagesChosen = require("./data/langchosen.json");
        });
    }

    this.SetLanguageGuild = function(key, val) {
        if (!this.LanguagesAvailable[val]) return "notavailable";

        this.LanguagesChosenGuild[key] = val;
        require('fs').writeFile("./data/languagechosenguild.json", 
        JSON.stringify(this.LanguagesChosenGuild, null , 4), 'utf8', () => {
          this.LanguagesChosenGuild = require("./data/languagechosenguild.json");
        });
    }

    this.StringFormat = function(str, ...args) {
      let text = str.format(args);
      return text;
    }

    return this
}

module.exports = Translate();