const express = require('express');
const router = express.Router();

// importing controller file
const ResumeController = require('./../controllers/resumeController');

// assigning functions to request

router.get('/', ResumeController.getResumePage);

// exporting module to access from another module
module.exports = router;