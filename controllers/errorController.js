const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.showError = (req, res, next) => {
    res.sendFile('error.html', { root: viewsPath });
}