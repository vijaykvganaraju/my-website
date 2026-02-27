import express from 'express';
const router = express.Router();
import * as ResumeController from '../controllers/resumeController.js';
router.get('/', ResumeController.getResumePage);
export default router;
