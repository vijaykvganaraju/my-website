const express = require('express');
const app = express();

app.use(express.static('views'));
const path = __dirname + '/views'

app
    .get('/', (req, res, next) => {
        res.sendFile('index.html', {root: path});
    })
    .get('/about', (req, res, next) => {
        res.sendFile('about.html', { root: path });
    })
    .get('/portifolio', (req, res, next) => {
        res.sendFile('portifolio.html', { root: path });
    })
    .get('/resume', (req, res, next) => {
        res.sendFile('resume.html', { root: path });
    })
    .get('/blog', (req, res, next) => {
        res.sendFile('blog.html', { root: path });
    })
    .get('/contact', (req, res, next) => {
        res.sendFile('contact.html', { root: path });
    });
    
module.exports = app;