const express = require('express');
const router = express.Router();

// importing controller file
const portfolioController = require('./../controllers/portfolioController');

// assigning functions to request

router.get('/', portfolioController.getportfolioPage);


// exporting module to access from another module
module.exports = router;