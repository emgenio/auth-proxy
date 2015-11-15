/**
 * Returns a successful require from the first module
 * which exists in a list of possible modules.
 * @param  {[type]} require      [description]
 * @param  {[type]} posibilities [description]
 * @return {[type]}              [description]
 */
var aquire = function aquire (require, posibilities) {
    for(var i=0; i < posibilities.length; i++) {
        var module = posibilities[i];
        try {
            return require(module);
        } catch (e) {
            log.debug('[DEBG] Attempted to load ' + module);
        }
    }
};

/**
 * Abstracts the if config.proxy.json call
 * @param  {[type]} res    [description]
 * @param  {[type]} status [description]
 * @param  {[type]} json   [description]
 * @return {[type]}        [description]
 */
var errorSend = function errorSend (res, status, json) {
    if (config.proxy.json) {
        res.status(status).json(json);
    } else {
        res.status(status).send();
    }
}

module.exports = {
    aquire: aquire,
    errorSend: errorSend
}