const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getAboutPage = (req, res, next) => {
    res.sendFile('about.html', {root: viewsPath});
}