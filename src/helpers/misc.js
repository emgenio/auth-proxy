var config = global.config;

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
var csend = function csend (res, status, json, message) {
    if (config.proxy.json) {
        res.status(status).json(json);
    } else {
        res.status(status).send(message);
    }
}

module.exports = {
    aquire: aquire,
    errorSend: function (res, status, json) {
        csend(res, status, json, json.error.message);
    },
    validSend: function (res, status, json) {
        csend(res, status, json, json.data.message);
    }
}