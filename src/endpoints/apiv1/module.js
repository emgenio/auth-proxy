var main_router = require('express').Router({mergeParams: true});
var router = require('express').Router();

main_router.use('/service', require('./service')());

if (config.proxy.api.testMode) {
    main_router.use('/test', require('./test')());
}

router.use(function (req, res, next) {
    if (config.proxy.api.enabled && 
        config.proxy.api.allowedHosts.indexOf(req.hostname) != -1) {
        return main_router(req, res, next);
    }
    next();
});
module.exports = router;
