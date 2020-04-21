const path = require('path');
const mongoose = require('mongoose');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getBlogPage = (req, res, next) => {
    
    res.render('blog');
};