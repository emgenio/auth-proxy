var main_router = require('express').Router({mergeParams: true});
var router = require('express').Router();
// var ACL = require('../../acl');
// var roles = require('./roles');
// var acl_controller = new ACL(roles);
// // Install our JWT Token middleware

// router.use(ACL.jwt.decrypt());

// main_router.use('/users', require('./users')(acl_controller));
main_router.use('/service', require('./service')());
main_router.use('/test', require('./test')());
router.use(main_router);
// router.use('/account/:account', main_router, require('./accounts')(acl_controller));
module.exports = router;
