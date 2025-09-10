import express from 'express';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';
import { getBlogDetail, getBlogPage } from '../../controllers/blogController.mjs';

const router = express.Router();

router.get('/blog', getUserFromToken, getBlogPage);
router.get('/blog/:id', getUserFromToken, getBlogDetail);

export default router;
