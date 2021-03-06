var errorSend = require('./misc').errorSend;

/**
 * Routes traffic through to backends after
 * confirming eligibilbity.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var serviceRouter = function serviceRouter(req, res, next) {
    var path = req.path;
    var host = req.hostname.replace(/\./g, '_');
    var serviceData;
    if (!(serviceData = global.storage.get(host))) {
        return next();
    }


    var routeMap = serviceData.get('routeMap');
    var role;

    // We don't traverse storage to get routemap because path could be regex
    if (role = routeMap.get(path)) {
        var baseUri = serviceData.get('baseUri');
        var uriExtract = require('url').parse(baseUri);
        var isSSL = uriExtract.protocol === 'https:';
        var roles = serviceData.get('roleTables');
        var acl = require('../acl').createInstance(roles[0], roles[1]);


        return acl.allow(role)(req, res,
            makeRequest.bind(this, req, res, uriExtract.hostname, uriExtract.port, isSSL)
        );
    }

    return next()
}

/**
 * Saves the chunks of body to the rawBody variable
 * @param  {request} request The expressjs proxy request
 * @param  {string} chunk   Chunk of request body data
 * @return {void}
 */
var pipeReq = function pipeReq (request, chunk) {
    request.rawBody += chunk;
}

/**
 * Writes chunks of data to the response obj
 * @param  {response} response The proxy response object
 * @param  {string} chunk    Chunk of response data
 * @return {void}
 */
var pipeRes = function pipeRes (response, chunk) {
    response.write(chunk);
}

/**
 * Forwards the data from the backend to the frontend
 * @param  {response} proxyResponse   The expressjs proxy response obj
 * @param  {response} backendResponse The backend http.response obj
 * @return {void}
 */
var forwardResponse = function forwardResponse (proxyResponse, backendResponse) {
    backendResponse.setEncoding('utf8');
    backendResponse.on('data', pipeRes.bind(this, proxyResponse));
    backendResponse.on('end', proxyResponse.end.bind(proxyResponse));
};

/**
 * Error handler which logs to logger
 * @param  {string|obj} err Error to log
 * @return {void}
 */
var handleError = function handleError (res, err) {
    global.log.warn('[WARN] Failed to process a request: ' + err);
    return errorSend(res, 500, {
        error: {
            status: 'Server Error',
            message: err
        }
    });
}


/**
 * Takes a req and res object from express and forwards a
 * request to the destination host.
 * @param  {object} req      The express request object
 * @param  {object} res      The express response object
 * @param  {string} destHost The destination host to 
 * forward the request to.
 * @param  {string} destPort The destination port
 * @return {void}
 */
var makeRequest = function makeRequest (req, res, destHost, destPort, isSSL) {
    if (isSSL) {
        var request = require('https').request;
        var protocol = 'https:';
        var defaultPort = 443;
    } else {
        var request = require('http').request;
        var protocol = 'http:';
        var defaultPort = 80;
    }

    if (req.headers.hasOwnProperty('x-override-host')) {
        req.headers.host = req.headers["x-override-host"];
    }
    
    var options = {
        hostname: destHost,
        port: destPort || defaultPort, // Actually handled by node for us either way
        method: req.method,
        path: req.path,
        headers: req.headers,
        protocol: protocol
    };
    clientReq = request(options, forwardResponse.bind(this, res));
    clientReq.on('error', handleError.bind(this, res));
    clientReq.write(req.rawBody);
    clientReq.end();
};

module.exports = {
    
    request: makeRequest,

    /**
     * Simply logs request chunks to "rawBody"
     * @param  {request}   req  Express request obj
     * @param  {response}   res  Express response obj
     * @param  {Function} next Next Express middleware in stack
     * @return {void}
     */
    rawBody: function rawBody (req, res, next) {
        req.rawBody = "";
        req.on('data', pipeReq.bind(this, req));
        next();
    },

    /**
     * Remove routes from the express router stack
     * @param  {string} route
     * @return {boolean}
     */
    routeRemover: function routeRemover (route) {
        for (var i = 0, len = this.stack.length; i < len; ++i) {
            if (this.stack[i].route == route) {
                this.stack.splice(i, 1);
                return true;
            };
        }
        return false;
    },

    serviceRouter: serviceRouter
}