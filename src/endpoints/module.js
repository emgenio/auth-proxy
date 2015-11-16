var currentApi = require('./apiv1/module');
var requestHandler = require('../helpers/request').serviceRouter;

module.exports = {
    "index_routes": {
        location: '/',
        callback: requestHandler
    },
    "api_v1": {
        location: '/apiv1/',
        callback: currentApi
    }
}
