const express = require('express');
const router = express.Router();

// importing controller file
const IndexController = require('./../controllers/indexController');

// assigning functions to request
router.get('/', IndexController.getHomePage);

// exporting module to access from another module
module.exports = router;