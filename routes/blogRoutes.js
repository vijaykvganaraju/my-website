import express from 'express';
const router = express.Router();

import * as BlogController from '../controllers/blogController.js';
import checkAuth from '../middleware/checkAuth.js';
router.get('/', BlogController.getBlogPage);

router.get('/next', BlogController.getBlogPage);

router.get('/prev', BlogController.getBlogPage);

router.get('/new', BlogController.createNewBlog);

router.get('/edit/:slug', BlogController.editOrDeleteBlog);

router.get('/delete/:slug', BlogController.editOrDeleteBlog);

router.get('/tag/:tag', BlogController.getBlogsWithTag);

router.get('/:slug', BlogController.getSpecificBlog);

router.post('/', checkAuth, BlogController.setNewBlog);

router.put('/', checkAuth, BlogController.saveEditedBlog);

router.delete('/', checkAuth, BlogController.deleteBlog);
export default router;
