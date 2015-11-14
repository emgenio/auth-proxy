var memory = function memory() {
    this.name = "memory";
    this._store = {};
}

memory.prototype.get = function (key) {
    if (this._store.hasOwnProperty(key)) {
        return this._store[key];
    }

    return;
}

memory.prototype.set = function (key, value) {
    return this._store[key] = value;
}

module.exports = memory;