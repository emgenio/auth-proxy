// Register Service
var registerService = function (req, res) {
    // Unique Service Name
    // Service Role Table
    // Route & Role Map
};

// Delete service
var deleteService = function (req, res) {

};

// Add service route
var registerRoute = function (req, res) {

}

// Delete service route
var deleteRoute = function (req, res) {
    var removeRoute = require('express-remove-route');
};

module.exports = function () {
    var router = require('express').Router({mergeParams: true});

    // Add routes to router
    router.post('/', registerService);
    router.delete('/:service_id', deleteService);
    router.post('/:service_id', registerRoute);
    router.delete('/:service_id/:route_id', deleteRoute);

    return router;
};