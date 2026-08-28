import http from 'node:http';
import app, { connectDatabase } from './app.js';

const port = process.env.PORT || 9000;
const server = http.createServer(app);

server.on('error', (err) => {
    console.error('Server failed:', err.message);
    process.exit(1);
});

const startServer = async () => {
    await connectDatabase();

    server.listen(port, () => {
        console.log(`Listening on ${port}`);
    });
};

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
