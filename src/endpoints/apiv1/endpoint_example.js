// module.exports = function (acl_controller) {
//     var router = require('express').Router({mergeParams: true});
//     var acl = require('../../acl');

//     router.get('/', acl_controller.allow('account_details'), (req, res) => {
//         res.send('This will show the details of a single account');
//     });

//     return router;
// };
