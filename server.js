import http from 'node:http';
import app from './app.js';
const port = process.env.PORT || 9000;
http.createServer(app)
    .listen(port, () => {
        console.log(`Listening on ${ port }`);
        
    });
