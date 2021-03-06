var YAML = require('yamljs');
var cli = require('./cli');
var config = {};

var startupErrors = [];

process.on('exit', function (code) {
    if (code != 0) {
        console.log(cli.cli.getUsage());
        startupErrors.forEach(function(message) {
            log.error(message);
        });
    }
})

// Set the log level from CLI
if (cli.options.loglevel) {
    log.setLevel(5 - cli.options.loglevel.length);
}

// Load config file from default location or as specified in CLI
if (cli.options.config) {
    var file = cli.options.config;
} else {
    var file = '/etc/eap/config.yaml';
    log.debug('[DEBG] Trying to load default config ' + file);
}

try {
    var config = YAML.load(file);
    if (!config) {
        startupErrors.push('[EROR] Config file empty ' + file);
        process.exit(1);
    }
    log.debug('[DEBG] Config is: ' + JSON.stringify(config, null, 4));
} catch (err) {
    startupErrors.push('[EROR] Failed to load config file ' + file);
    log.debug(err);
    process.exit(1);
}

// Overide config file with cli args
if (cli.options.json) {
    config.proxy.jsonErrors = cli.options.json;
}


module.exports = config;