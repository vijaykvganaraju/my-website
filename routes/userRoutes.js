import express from 'express';
const router = express.Router();

import * as UserController from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';

router.get('/', checkAuth, UserController.getUsers);
router.post('/', checkAuth, UserController.createUser);

export default router;
