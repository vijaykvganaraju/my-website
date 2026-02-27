import express from 'express';
const router = express.Router();
import * as ContactController from '../controllers/contactController.js';
router.get('/', ContactController.getContactPage);

router.post('/', ContactController.contactMe);
export default router;
