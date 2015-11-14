// Setup global Log
global.log = require('loglevel');
    log.setDefaultLevel(log.levels.ERROR);

// Setup global config
global.config = require('./config');

// Setup global memory storage
global.storage = new require('./storage')();