import express from 'express';
const router = express.Router();
import * as IndexController from '../controllers/indexController.js';
router.get('/', IndexController.getHomePage);
export default router;
