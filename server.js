var https = require('https');
var http = require('http');
var fs = require('fs');
var app = require('./app');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

http.createServer(app).listen(process.env.PORT || 9000 );
https.createServer(options, app).listen(443);