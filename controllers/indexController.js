const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getHomePage = (req, res, next) => {
    res.sendFile('index.html', { root: viewsPath });
}