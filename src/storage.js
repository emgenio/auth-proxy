var storageModules = [
    config.proxy.storage,
    './storage/' + config.proxy.storage,
    './storage/memory'
];
var aquire = require('./helpers/misc').aquire;
var storage = aquire(require, storageModules);

if (!storage) {
    log.error('[EROR] Failed to initialise storage');
    process.exit(1);
}

if (storage.name == "memory")
{
    log.warn("[WARN] Using fallback storage: ./storage/memory.")
    log.warn("Do not use in production!")
}

log.info('[INFO] Using storage module ' + storage.name);
module.exports = storage;