const express = require('express');
const router = express.Router();

// importing controller file
const BlogController = require('./../controllers/blogController');

// assigning functions to request
router.get('/', BlogController.getBlogPage)

// exporting module to access from another module
module.exports = router;