// import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const path = __dirname + '/views';

// Initialize this only when running on localhost
// const process = require('./dummyProcess');

// import routes files 
const indexRoutes = require('./routes/indexRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const portifolioRoutes = require('./routes/portifolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorRoutes = require('./routes/errorRoutes');

// accessing files
app.use(express.static(__dirname + '/views'));

// setting view engine to ejs for templating
app.set('view engine', 'ejs');

// For parsing the data sent through requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connecting database

mongoose.connect(
    'mongodb+srv://' + process.env.MONGO_ATLAS_USERNAME + ':' +
    process.env.MONGO_ATLAS_PASSWORD +
    '@my-apis-kff0p.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

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
app.use('/portifolio', portifolioRoutes);
app.use('/resume', resumeRoutes);
app.use('/blog', blogRoutes);
app.use('/contact', contactRoutes);
app.use('/error', errorRoutes);

app.use((req, res, next) => {
    const error = new Error('Invalid request')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.redirect('/error');
});

module.exports = app;