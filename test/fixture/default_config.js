var config = {
  "proxy": {
    "port": 3301,
    "storage": "memory",
    "jsonResponses": true,
    "token": {
      "usesHeader": true,
      "header": "X-Auth",
      "json": "token",
      "key": "HYS^Jhs729kas6J^3j36H6%#,82",
      "duration": 60
    },
    "api": {
      "enabled": true,
      "allowedHosts": [
        "authproxy.emgen.io",
        "192.168.99.100",
        "localhost"
      ],
      "testMode": false
    }
  }
}

module.exports = config;