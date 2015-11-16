/**
 * Storage constructor. Good place to recover data when process crashes
 * Takes no arguments.
 * @return {[type]} [description]
 */
var generic = function generic() {};

/**
 * Allows instantiating with an object. Saves running a loop
 * and entering via .set method.
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
generic.createInstance = function createInstance (object) {};

/**
 * Allows complete replacement of the internal store object
 * @param {[type]} object [description]
 */
generic.prototype.setStore = function setStore (object) {};

/**
 * Get the internal store object
 * @return {[type]} [description]
 */
generic.prototype.getStore = function getStore() {};

/**
 * Get a property of the internal store object
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
generic.prototype.get = function get (key) {};

/**
 * Set the value of a property in the internal store object
 * @param {[type]} key   [description]
 * @param {[type]} value [description]
 */
generic.prototype.set = function set (key, value) {};

/**
 * Find an object similar to find and set the resulting object
 * to the specified value
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
generic.prototype.dotSet = function dotSet (key, value) {};

/**
 * Using dot notation, try and find a key nested deeply
 * in the object store. Only traverses tree if sub-objects are
 * also storage objects.
 * @param  {[type]} dotFind [description]
 * @return {[type]}         [description]
 */
generic.prototype.find = function find (dotFind) {};

/**
 * Called before the process shuts down to save data
 * @return {[type]} [description]
 */
generic.prototype.shutdown = function shutdown () {};

module.exports = generic;