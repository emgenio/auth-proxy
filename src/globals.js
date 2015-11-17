// Setup global Log
global.log = require('loglevel');
    log.setDefaultLevel(log.levels.ERROR);

// Setup global config
global.config = require('./config');
var storage = require('./storage');
// Setup global memory storage
var m = new storage();
global.storage = m;