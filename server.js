var https = require('https');
var fs = require('fs');
var app = require('./app');
const port = process.env.PORT || 3000;

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(port, () => console.log(`Listening on Port ${port}`));