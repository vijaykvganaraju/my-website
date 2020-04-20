const express = require('express');
const router = express.Router();

// importing controller file
const ContactController = require('./../controllers/contactController');

// assigning functions to request

router.get('/', ContactController.getContactPage);

router.post('/', ContactController.contactMe);

// exporting module to access from another module
module.exports = router;