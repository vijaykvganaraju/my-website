// import modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = __dirname + '/views';

// import routes files 
const indexRoutes = require('./routes/indexRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const portifolioRoutes = require('./routes/portifolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');

// accessing files
app.use(express.static('views'));

// setting view engine to ejs for templating
app.set('view engine', 'ejs');

// For parsing the data sent through requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


module.exports = app;