import express from 'express';
const router = express.Router();

import * as UserController from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';
import requireRole from '../middleware/requireRole.js';

router.get('/', checkAuth, requireRole('admin'), UserController.getUsers);
router.post('/', checkAuth, requireRole('admin'), UserController.createUser);

export default router;
