/**
 * This acl function helps to manage authentication
 * when passed a simple role table.
 */
var errorSend = require('./helpers/misc').errorSend;
var config = global.config;

/**
 * Parses the acl object into a two dimentional matrix for easier parsing
 */
var parse_table = function (acl_table, role) {
    // Have we found a root role?
    if (!acl_table.hasOwnProperty(role)) {
        // If so return it
        return [];
        // Something tells me this could cause a security hole :S
        // Perhaps we should error hardcore because it's an unexpected role?
    } else if (!acl_table[role].inherits || acl_table[role].inherits.length == 0) {
        return [];
    }
    
    var roles = acl_table[role].inherits;
    for(var role_index in roles) {
        var s_role = roles[role_index];
        roles = roles.concat(parse_table(acl_table, s_role));
    }

    return roles;
};

/**
 * ACL Constructor
 * Takes the acl_table as an argument. Here's an example acl table:
 *
 * var acl_table = {
 *     guest: {
 *          requires_token: false
 *     },
 *     user: {
 *         inherits: ['guest']
 *     },
 *     product_read: {
 *         inherits: ['user']
 *     },
 *     product_write: {
 *         inherits: ['user']
 *     },
 *     product_modify: {
 *         inherits: ['user']
 *     },
 *     product_admin: {
 *         inherits: ['product_write','product_read','product_modify']
 *     }
 * };
 */
var ACL = function (acl_table) {
    this._acl_table = acl_table;
    
    var roles_table = {};
    for(var role in acl_table) {
        roles_table[role] = parse_table(this._acl_table, role);
    }

    this._role_table = roles_table;

};

/**
 * Allows instantiated ACL from a table returned by getTable
 * @param  {[type]} parsed_table [description]
 * @return {[type]}              [description]
 */
ACL.createInstance = function (parsed_table) {
    var instance = new ACL();
    instance._role_table = parsed_table;
    return instance;
}

/**
 * [getTable description]
 * @return {[type]} [description]
 */
ACL.prototype.getTable = function getTable() {
    return this._role_table;
}


/**
 * Checks if a role is in a role chain.
 * For example to test if a user with a `product_read` role
 * can has clearance for a user level operation do:
 *    ACL.hasClearance('product_read', 'user');
 */
ACL.prototype.hasClearance = function (roles_to_test, role) {
    if (!Array.isArray(roles_to_test)) {
        if (roles_to_test == role) {
            return true;
        } else {
            return this._role_table[roles_to_test].indexOf(role) > -1;
        }
    } else {
        for(var key in roles_to_test) {
            var i_role = roles_to_test[key];
            if (this.hasClearance(i_role, role)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Expressjs middleware. Acts as a gateway to lockdown a route to
 * a specific role
 */
ACL.prototype.allow = function (role) {
    var self = this; // Give access to the ACL's context
    return (req, res, next) => {
        // If in the ACL Table, our role doens't require a token
        // then lets just let the user pass
        if (self._acl_table[role].hasOwnProperty('requires_token')) {
            if (self._acl_table[role].requires_token == false) {
                return next();
            }
        }

        // If there's no roles associated with the key, we're not
        // logged in.
        if (!req.key_roles) {
            return errorSend(res, 403, {
                error: {
                    status: 'Unauthorized',
                    reason: 'API Key Missing'
                }
            });
        }

        // Finally confirm the API key in use actually has the role
        // we're looking for
        if (!self.hasClearance(req.key_roles, role)) {
            return errorSend(res, 403, {
                error: {
                    status: 'Unauthorized',
                    reason: 'Not authorized to access this endpoint'
                },
                meta: {
                    details: 'Endpoint requires ' +role+ ' permission',
                    authorized_for: req.key_roles
                }
            });
        }

        // No errors so she's all shiny captain.
        return next();
    }; 
};

// Initialise the JavaScript Web Token helper
ACL.jwt = {
    token_header: config.proxy.token.header,
    token_json: config.proxy.token.json,
    key: config.proxy.token.key,
    session_length: config.proxy.token.duration // In minutes
};

/**
 * The jwt.decrypt middleware function helps to decrypt
 * jwt tokens and populate the req object ready for use
 * in the ACL.
 */
ACL.jwt.decrypt = function () {
    return (req, res, next) => {
        if (config.proxy.token.usesHeader) {
            var token = req.get(this.token_header);
        } else {
            var token = req.get(this.token_json);
        }
            
        // If we haven't got a token we just let things go
        // we're not sure at this stage wether ACL is in effect for
        // the resulting endpoint
        if (!token) {
            return next();
        }

        var token_parts         = token.split('.');
        var token_header        = token_parts[0];
        var token_payload       = token_parts[1];
        var token_signature     = token_parts[2];

        var base64_header = token_header;
        token_header = JSON.parse(
                new Buffer(token_header, 'base64').toString("ascii")
        );

        var base64_payload = token_payload;
        token_payload = JSON.parse(
                new Buffer(token_payload, 'base64').toString("ascii")
        );

        // Check token expiry
        if (this.session_length !== 0) {
            var now = new Date();
            var maximum_session = new Date(now + (this.session_length * 60000));
            var token_generated = new Date(token_payload.when);
            if (token_generated > maximum_session) {
                return errorSend(res, 440, {
                    error: {
                        status: "Unauthorized",
                        message: "Token expired"
                    }
                });
            }
        }
        
        // Check token header
        if (!token_header.hasOwnProperty('alg') || !token_header.hasOwnProperty('typ')) {
            return errorSend(res, 403, {
                error: {
                    status: "Unauthorized",
                    message: "Invalid token header"
                }
            });
        }

        if (token_header.alg != "HS512" || token_header.typ != "JWT") {
            return errorSend(res, 403, {
                error: {
                    status: "Unauthorized",
                    message: "Unsupported Algorithm or Token type"
                }
            });
        }

        // Check token payload
        if (!token_payload.hasOwnProperty('key_roles')) {
            return errorSend(res, 403, {
                error: {
                    status: "Unauthorized",
                    message: "Invalid Token"
                },
                meta: {
                    description: "This token isn't associated with any role. ¿haxor?"
                }
            });
        }

        // Generate a signature to cross-check
        var crypto = require('crypto');
        var verification_signature = crypto
            .createHmac('sha512', this.key)
            .update(base64_header + "." + base64_payload)
            .digest('base64');

        // Do we have a valid JW Token?
        if (verification_signature == token_signature) {
            req.key_roles = token_payload.key_roles;
            return next();
        } else {
            return errorSend(res, 403, {
                error: {
                    status: "Unauthorized",
                    message: "Unable to verify token signature"
                }
            });
        }
    }
};

ACL.jwt.encrypt = function (data) {
    data.when = new Date();

    var header = {
        alg: "HS512",
        typ: "JWT"
    };
    
    var base64_header = (new Buffer(JSON.stringify(header))).toString('base64');
    var base64_payload = (new Buffer(JSON.stringify(data))).toString('base64');
    var token = base64_header + "." + base64_payload;
    var crypto = require('crypto');
    var token_signature = crypto
        .createHmac('sha512', this.key)
        .update(new Buffer(token))
        .digest('base64');

    token = token + "." + token_signature;

    return token;
};

module.exports = ACL;
