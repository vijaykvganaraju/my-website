var https = require('https');
var fs = require('fs');
var app = require('./app');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(process.env.PORT || 3000);