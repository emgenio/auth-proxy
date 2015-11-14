require('./version');
require("./globals");

var express = require("express");
var endpoints = require("./endpoints/module.js");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var rawBodySaver = require('./helpers/request').rawBody;

// Add a global raw body saving middleware
app.use(rawBodySaver);
// Add a global JSON parsing middleware
app.use(bodyParser.json());

// Loop through endpoints and add them to the router.
for(var key in endpoints) {
    // Confirm we have every property
    var endpoint = endpoints[key];

    if (!endpoint.hasOwnProperty('location') ||
        !endpoint.hasOwnProperty('callback')) {
        log.debug('[DEBG] Bad endpoint obj '+ JSON.stringify(endpoint, null, 4));
        continue;
    }

    if (endpoint.hasOwnProperty('method')) {
        try {
            app[endpoint.method](endpoint.location, endpoint.callback);
        } catch (err) {
            log.warn('[WARN] Unable to mount endpoint '+ endpoint.location);
        }
    } else {
        try {
            app.use(endpoint.location, endpoint.callback);
        } catch (err) {
            log.warn('[WARN] Unable to mount endpoint '+ endpoint.location);
        }
    } 
}

var server = app.listen(config.proxy.port, () => {
    log.info("[INFO] Server has begun listening");
});
