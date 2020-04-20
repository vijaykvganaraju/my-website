const http = require('http');
const port = process.env.PORT || 9000;

const app = require('./app');

http
    .createServer(app)
    .listen(port, () => console.log(`Listening on Port ${ port }`));