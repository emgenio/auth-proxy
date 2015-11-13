module.exports = function () {
    var router = require('express').Router({mergeParams: true});

    router.all(/^\/forwarder(\/\w*)/, (req, res) => {
        var forwarder = require('../../helpers/request').request;
        req.headers.Host = 'emgen.io';
        req.url = req.params[0];
        forwarder(req, res, 'emgen.io', 443, true);
    });

    return router;
};