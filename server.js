var http = require('http');
var app = require('./app');


http.createServer(app).listen(process.env.PORT || 9000 );
