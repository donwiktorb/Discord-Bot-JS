function Functions() {
    var self = {}
    self.Functions = {}

    self.Set = function(key, value) {
        self[key] = value
    }

    self.Get = function(key) {
        return self[key];
    }

    self.GetFunctionData = function(key) {
        return self.Functions[key]
    }

    self.Add = function(name, fnc) {
        if (!self.Functions[name])
            self.Functions[name] = fnc
        else 
            return console.log("[dwb_core/functions] Function "+name+" already in list.")
    }

    self.Execute = function(name, ...args) {
        if (!self.Functions[name])
            return console.log("Theres no function "+name)
        try {
            return self.Functions[name](...args)
        } catch(e) {
            return console.log("Error executing function "+name+" with args "+ args +" \n "+e)
        }
    }

    // https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    self.sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    self.CreateThread = async function(wait, Function) {
        do {
            await console.log("Waiting for client 8 seconds");
            await self.sleep(8000);
        } while (typeof client == undefined);

        await console.log("Starting threads");

        let index = 0;

        for (let key in self.Functions) {
            index = index + 1;
        }

        self.Add(index, {
            "Function": Function,
            "wait": wait * 1000
        });

        self.StartThread(index);

        return new Promise(resolve => {
            let thread = {}

            thread.stop = function() {
                delete self.Functions[index];
            }

            thread.name = index;

            resolve(thread);
        });

    }

    self.StartThread = function(name) {
        let data = self.GetFunctionData(name);
        if (!data) return console.log("Thread " +name+" stopped");

        setTimeout(self.StartThread, data.wait, name, true);
        try {
            data.Function();
        } catch(e) {
            delete self.Functions[name];
            return console.log("Error executing function "+name + "\n"+e)
        }
    }

    self.IsFunction = function(name) {
        return self.Funtions[name] && true || false
    }

    return self
}

module.exports = Functions();