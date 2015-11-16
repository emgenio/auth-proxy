var Validator = require('../../helpers/validator');
var errorSend = require('../../helpers/misc').errorSend;
var validSend = require('../../helpers/misc').validSend;

// Create a validator for registering services
var validateRegisterService = Validator.NewValidator({
    hostname: {
        required: true
    },
    roleTable: {
        required: true
    },
    routeMap: {
        required: true
    },
    baseUri: {
        required: true
    }
});

// Create a validator for deleting services
var validateDeleteService = Validator.NewValidator({
    hostname: {
        required: true
    }
});

// Create a validator for deleting routes
var validateDeleteRoute = Validator.NewValidator({
    hostname: {
        required: true
    },
    path: {
        required: true
    }
});

// Create a validator for adding routes
var validateRegisterRoute = Validator.NewValidator({
    hostname: {
        required: true
    },
    path: {
        required: true
    },
    role: {
        required: true
    }
});

// Register Service
var registerService = function registerService (req, res) {
    // Unique Service Name
    // Service Role Table
    // Route & Role Map
    

    if (validateRegisterService.validate(req.body).length) {
        return errorSend(res, 400, {
            error: {
                status: 'Bad Request',
                message: 'Failed to provided required fields'
            },
            meta: {
                required_fields: ['hostname', 'roleTable', 'roleMap', 'baseUri']
            }
        })
    }

    var service = req.body.hostname.replace(".", "_");
    // Parse role table
    var table = (new require('../../acl')(req.body.roleTable)).getTable();


    storage.set(service, {});
    storage.dotSet(service + '.routeMap', req.body.routeMap);
    storage.dotSet(service + '.roleTable', table);
    storage.dotSet(service + '.baseUri', req.body.baseUri);

    return validSend(res, 200, {
        data: {
            status: 'Operation Complete',
            message: 'Added service successfully'
        }
    });
};

// Delete service
var deleteService = function deleteService (req, res) {
    if (validateDeleteService.validate(req.body).length) {
        return errorSend(res, 400, {
            error: {
                status: 'Bad Request',
                message: 'Failed to provided required fields'
            },
            meta: {
                required_fields: ['hostname']
            }
        })
    }

    storage.set(
        req.body.hostname.replace(".", "_"),
        undefined
    );

    return validSend(res, 200, {
        data: {
            status: 'Operation Complete',
            message: 'Deleted service successfully'
        }
    });
};

// Add service route
var registerRoute = function registerRoute (req, res) {
    if (validateRegisterRoute.validate(req.body).length) {
        return errorSend(res, 400, {
            error: {
                status: 'Bad Request',
                message: 'Failed to provided required fields'
            },
            meta: {
                required_fields: ['hostname', 'path', 'role']
            }
        })
    }

    var service = req.body.hostname.replace('.', '_');
    var routeMap = storage.dotFind(service + '.routeMap');
    routeMap[req.body.path] = req.body.role;
    storage.dotSet(service + '.routeMap', routeMap);

    return validSend(res, 200, {
        data: {
            status: 'Operation Complete',
            message: 'Added route successfully'
        }
    });
}

// Delete service route
var deleteRoute = function deleteRoute (req, res) {
    if (validateDeleteRoute.validate(req.body).length) {
        return errorSend(res, 400, {
            error: {
                status: 'Bad Request',
                message: 'Failed to provided required fields'
            },
            meta: {
                required_fields: ['hostname', 'path']
            }
        })
    }

    var service = req.body.hostname.replace('.', '_');
    var routeMap = storage.dotFind(service + '.routeMap');
    delete routeMap[req.body.path];
    storage.dotSet(service + '.routeMap', routeMap);

    return validSend(res, 200, {
        data: {
            status: 'Operation Complete',
            message: 'Deleted route successfully'
        }
    });
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