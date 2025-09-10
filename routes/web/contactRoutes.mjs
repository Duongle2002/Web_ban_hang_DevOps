import express from 'express';
import { contactPage, submitMessage } from '../../controllers/contactController.mjs';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/contact', getUserFromToken, contactPage);
router.post('/contact/submit', getUserFromToken, submitMessage);

export default router;
