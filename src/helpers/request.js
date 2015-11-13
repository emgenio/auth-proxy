var pipeReq = function (request, chunk) {
    request.rawBody += chunk;
}

var pipeRes = function (response, chunk) {
    response.write(chunk);
}

var forwardResponse = function forwardResponse (proxyResponse, backendResponse) {
    backendResponse.setEncoding('utf8');
    backendResponse.on('data', pipeRes.bind(this, proxyResponse));
    backendResponse.on('end', proxyResponse.end.bind(proxyResponse));
};

var handleError = function (err) {
    //log.warn('Failed to process a request: ' + JSON.stringify(err, null, 4));
    log.warn('Failed to process a request: ' + err);
}

/**
 * Takes a req and res object from express and forwards a
 * request to the destination host.
 * @param  {object} req      The express request object
 * @param  {object} res      The express response object
 * @param  {string} destHost The destination host to 
 * forward the request to.
 * @param  {string} destPort The destination port
 * @return {none}
 */
module.exports = {
    request: function makeRequest (req, res, destHost, destPort, isSSL) {
        if (isSSL) {
            var request = require('https').request;
            var protocol = 'https:';
        } else {
            var request = require('http').request;
            var protocol = 'http:';
        }

        
        var options = {
            hostname: destHost,
            port: destPort || 80, // Actually handled by node for us either way
            method: req.method,
            path: req.path,
            headers: req.headers,
            protocol: protocol
        };
        clientReq = request(options, forwardResponse.bind(this, res));
        clientReq.on('error', handleError);
        clientReq.write(req.rawBody);
        clientReq.end();
    },

    middleware: function (req, res, next) {
        req.rawBody = "";
        req.on('data', pipeReq.bind(this, req));
        next();
    }
}