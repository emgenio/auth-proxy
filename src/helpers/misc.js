var aquire = function aquire (require, posibilities) {
    for(var i=0; i < posibilities.length; i++) {
        var module = posibilities[i];
        try {
            return require(module);
        } catch (e) {
            log.debug('[DEBG] Attempted to load ' + module);
        }
    }
}

module.exports = {
    aquire: aquire
}