import express from 'express';
import { checkOutPage, createCheckout, getOrderHistory, getOrderDetail, cancelOrder } from '../../controllers/checkOutController.mjs';
import { isAuthenticated } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/checkout', isAuthenticated, checkOutPage);
router.post('/place-order', isAuthenticated, createCheckout);
router.get('/history', isAuthenticated, getOrderHistory);
router.get('/history/:id', isAuthenticated, getOrderDetail);
router.post('/history/:id/cancel', isAuthenticated, cancelOrder);

export default router;
