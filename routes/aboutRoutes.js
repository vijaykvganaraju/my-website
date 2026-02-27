import express from 'express';
const router = express.Router();
import * as AboutController from '../controllers/aboutController.js';
router.get('/', AboutController.getAboutPage);
export default router;
