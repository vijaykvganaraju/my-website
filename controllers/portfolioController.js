const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getportfolioPage = (req, res, next) => {
    res.sendFile('portfolio.html', { root: viewsPath });
}