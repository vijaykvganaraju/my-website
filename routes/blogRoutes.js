const express = require('express');
const router = express.Router();

// importing controller file
const BlogController = require('./../controllers/blogController');

// middleware or authenticator
const checkAuth = require('./../middleware/checkAuth');


// assigning functions to request
router.get('/', BlogController.getBlogPage);

router.get('/next', BlogController.getBlogPage);

router.get('/prev', BlogController.getBlogPage);

router.get('/new', BlogController.createNewBlog);

router.get('/edit/:slug', BlogController.editBlog);

router.get('/:slug', BlogController.getSpecificBlog);

router.get('/tag/:tag', BlogController.getBlogsWithTag);

router.post('/new', checkAuth, BlogController.setNewBlog);

router.put('/edit', checkAuth, BlogController.saveEditedBlog);

router.get('/delete/:id', checkAuth, BlogController.deleteBlog);


// exporting module to access from another module
module.exports = router;