import express from 'express';
import CartController from '../../controllers/cartController.mjs';
import { isAuthenticated } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/cart', isAuthenticated, CartController.viewCart);
router.post('/cart/add', isAuthenticated, CartController.addToCart);
router.post('/cart/update', isAuthenticated, CartController.updateQuantity);
router.post('/cart/remove', isAuthenticated, CartController.removeFromCart);

export default router;
