const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getResumePage = (req, res, next) => {
    res.sendFile('resume.html', { root: viewsPath });
}