import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import routes files 
import indexRoutes from './routes/indexRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';

// accessing files
app.set('views', join(__dirname, 'views'));
app.use('/assets', express.static(join(__dirname, 'views', 'assets')));
app.get('/manifest.webmanifest', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'manifest.webmanifest'));
});

// setting view engine to ejs for templating
app.set('view engine', 'ejs');

// Runs before body parsing so error pages still have activePage for the header.
app.use((req, res, next) => {
    if (req.path === '/') {
        res.locals.activePage = 'home';
    } else if (req.path.startsWith('/about')) {
        res.locals.activePage = 'about';
    } else if (req.path.startsWith('/portfolio')) {
        res.locals.activePage = 'portfolio';
    } else if (req.path.startsWith('/resume')) {
        res.locals.activePage = 'resume';
    } else if (req.path.startsWith('/blog')) {
        res.locals.activePage = 'blog';
    } else if (req.path.startsWith('/contact')) {
        res.locals.activePage = 'contact';
    } else {
        res.locals.activePage = '';
    }

    next();
});

// For parsing the data sent through requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express 5 leaves req.body undefined when there's no body; keep it an object.
app.use((req, res, next) => {
    if (req.body === undefined) {
        req.body = {};
    }
    next();
});

// connecting database
const getMongoUri = () => {
    if (process.env.MONGO_URI) {
        return process.env.MONGO_URI;
    }

    const mongoUser = process.env.MONGO_ATLAS_USERNAME;
    const mongoPassword = process.env.MONGO_ATLAS_PASSWORD;

    if (!mongoUser || !mongoPassword) {
        throw new Error('MongoDB credentials are missing. Set MONGO_URI or MONGO_ATLAS_USERNAME and MONGO_ATLAS_PASSWORD.');
    }

    return `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPassword)}@my-apis-kff0p.mongodb.net/my-website?retryWrites=true&w=majority`;
};

export const connectDatabase = () => mongoose.connect(getMongoUri());

// override with the other methods in the request
app.use(methodOverride('_method'));

// To prevent CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// assigning app routes to handle requests
app.use('/', indexRoutes);
app.use('/about', aboutRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/resume', resumeRoutes);
app.use('/blog', blogRoutes);
app.use('/contact', contactRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) => {
    const error = new Error('Invalid request');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const errorMessage = status === 404 ? 'Invalid URL' : 'Something went wrong. Please try again later.';

    if (status >= 500) {
        console.error(error);
    }

    res.status(status).render('ack_error', { errorMessage });
});

export default app;
