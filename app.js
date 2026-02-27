import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
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
app.use(express.static(join(__dirname, 'views')));

// setting view engine to ejs for templating
app.set('view engine', 'ejs');

// For parsing the data sent through requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// connecting database
const mongoUser = encodeURIComponent(process.env.MONGO_ATLAS_USERNAME || '');
const mongoPassword = encodeURIComponent(process.env.MONGO_ATLAS_PASSWORD || '');
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@my-apis-kff0p.mongodb.net/my-website?retryWrites=true&w=majority`;

mongoose.connect(mongoUri);

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
    const error = new Error('Invalid request')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('ack_error', { errorMessage: 'Invalid URL' });
});

export default app;
