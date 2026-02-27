import express from 'express';
const router = express.Router();
import * as portfolioController from '../controllers/portfolioController.js';
router.get('/', portfolioController.getportfolioPage);
export default router;
