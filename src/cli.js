var commandLineArgs = require('command-line-args'); 
var cli = commandLineArgs([
    {
        name: 'config',
        alias: 'c',
        type: String,
        value: '/etc/eap/config.yaml',
        typeLabel: '<file>',
        description: 'Location of the Auth Proxy config.yaml file'
    },
    { name: 'loglevel', alias: 'v', type: Boolean, multiple:true },
]);

module.exports  = {cli: cli, options: cli.parse()}