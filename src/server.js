require('./version');
global.config = require("./config");
var express = require("express");
var endpoints = require("./endpoints/module.js");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var rawBodySaver = require('./helpers/request').middleware;

// Add a global raw body saving middleware
app.use(rawBodySaver);
// Add a global JSON parsing middleware
app.use(bodyParser.json());

// Loop through endpoints and add them to the router.
for(var key in endpoints) {
    // Confirm we have every property
    var endpoint = endpoints[key];

    if (!endpoint.hasOwnProperty('method') ||
        !endpoint.hasOwnProperty('location') ||
        !endpoint.hasOwnProperty('callback')) {

        try {
            app.use(endpoint.location, endpoint.callback);
        } catch (err) {
            // TODO: Cry like a baby
        }
    }
}

var server = app.listen(config.proxy.port, () => {
    log.info("[INFO] Server has begun listening");
});
