var currentApi = require('./apiv1/module');


module.exports = {
    "index_routes": {
        location: '/',
        callback: currentApi
    },
    "api_v1": {
        location: '/apiv1/',
        callback: currentApi
    }
}
