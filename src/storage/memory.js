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

memory.prototype.getStore = function getStore() {
    return this._store;
};

memory.prototype.get = function (key) {
    if (this._store.hasOwnProperty(key)) {
        return this._store[key];
    }

    return;
};

memory.prototype.set = function (key, value) {
    if (toString.call(value) == '[object Object]' && value.name != 'memory') {
        value = memory.createInstance(value);
    }
    return this._store[key] = value;
};

memory.prototype.find = function find (dotFind) {
    var dotFindArray = dotFind.split('.');
    var current = this.get(dotFindArray.shift());

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