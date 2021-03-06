var memory = function memory() {
    this.name = "memory";
    this._store = {};
};

memory.createInstance = function createInstance (object) {
    var instance = new memory();
    instance.setStore(object);
    return instance;
};

memory.prototype.setStore = function setStore (object) {
    if (toString.call(object) != '[object Object]') {
        return false;
    }

    this._store = object;
    return true;
};

memory.prototype.getStore = function getStore () {
    return this._store;
};

memory.prototype.get = function get (key) {
    if (this._store.hasOwnProperty(key)) {
        return this._store[key];
    }

    return;
};

memory.prototype.set = function set (key, value) {
    if (toString.call(value) == '[object Object]' && value.name != 'memory') {
        value = memory.createInstance(value);
    }
    return this._store[key] = value;
};

memory.prototype.dotSet = function dotSet (key, value) {
    var dotFindArray = key.split('.');
    
    if (dotFindArray.length == 1) {
        this.set(key, value);
    } else {
        var a = dotFindArray.splice(0,1);
        var current = this.get(a);
        var key = dotFindArray.join('.');

        if (current == undefined) {
            current = this.set(a, {});
        }

        if (toString.call(current) == '[object Object]' && current.name == 'memory') {
            return this._store[a].dotSet(key, value);
        } else if (
            toString.call(current) == '[object Object]' 
            || toString.call(current) == '[object Array]') {
            return this._store[a][dotFindArray.join('.')] = value;
        }
    }
}

memory.prototype.find = function find (dotFind) {
    var dotFindArray = dotFind.split('.');
    var current = this.get(dotFindArray.splice(0,1));

    if (current) {
        if (dotFindArray.length == 0) {
            return current;
        }

        if (toString.call(current) == '[object Object]' && current.name == 'memory') {
            return current.find(dotFindArray.join('.'));
        } else if (
            toString.call(current) == '[object Object]' 
            || toString.call(current) == '[object Array]') {
            return current[dotFindArray.join('.')]
        }
    }
};

module.exports = memory;