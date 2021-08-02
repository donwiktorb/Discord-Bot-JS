function Commands() {
    var self = {}
    self.Commands = {}
    self.prefix = "?"

    self.Set = function(key, value) {
        self[key] = value
    }

    self.Add = function(name, fnc) {
        if (!self.Commands[name])
            self.Commands[name] = fnc
        else 
            return console.log("[dwb_core/commands] Command "+name+" already in list.")
    }

    self.GetCommandsNames = function() {
        let table = []
        for (let name in self.Commands) {
            table.push(name);
        }
        return table;
    }

    self.Execute = function(name, ...args) {
        if (!self.Commands[name])
            return
        try {
            self.Commands[name](...args)
        } catch(e) {
            return console.log("Error executing command "+name+" with args "+ args +" \n "+e)
        }
    }

    self.IsCommand = function(name) {
        return self.Commands[name] && true || false
    }

    return self
}

module.exports = Commands();