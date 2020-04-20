const express = require('express');
const router = express.Router();

// importing controller file
const PortifolioController = require('./../controllers/portifolioController');

// assigning functions to request

router.get('/', PortifolioController.getPortifolioPage);


// exporting module to access from another module
module.exports = router;