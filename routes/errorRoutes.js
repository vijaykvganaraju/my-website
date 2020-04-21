const express = require('express');
const router = express.Router();

// importing controller file
const ErrorController = require('./../controllers/errorController');

// assigning functions to request

router.get('/', ErrorController.showError);

// exporting module to access from another module
module.exports = router;