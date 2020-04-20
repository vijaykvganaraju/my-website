const path = require('path');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// route handles

exports.getPortifolioPage = (req, res, next) => {
    res.sendFile('portifolio.html', { root: viewsPath });
}