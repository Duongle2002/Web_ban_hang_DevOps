import express from 'express';
import { getProductDetail, getProductPage } from '../../controllers/productController.mjs';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/product', getUserFromToken, getProductPage);
router.get('/product/:id', getUserFromToken, getProductDetail);

export default router;
