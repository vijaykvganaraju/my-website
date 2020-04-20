const express = require('express');
const router = express.Router();

// importing controller file
const AboutController = require('./../controllers/aboutController');

// assigning functions to request

router.get('/', AboutController.getAboutPage);

// exporting module to access from another module
module.exports = router;