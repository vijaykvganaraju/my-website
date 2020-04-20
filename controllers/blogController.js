const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getBlogPage = (req, res, next) => {
    res.sendFile('blog.html', { root: viewsPath });
}