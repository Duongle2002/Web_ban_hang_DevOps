import express from 'express';
import { cancelOrder, createCheckoutApi, getOrderDetailApi, getOrderHistoryApi } from '../../controllers/checkOutController.mjs';
import { adminController, upload } from '../../controllers/adminController.mjs';
import { listUsers, getUser, createUser, updateUser, deleteUser, listProducts, getProduct, createProduct, updateProduct, deleteProduct, listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../../controllers/adminApiController.mjs';
import ProductService from '../../services/ProductService.mjs';
import { isAdmin, isAuthenticated } from '../../middleware/authMiddleware.mjs';
import { getBlogDetailAPI, getBlogsAPI } from '../../controllers/blogController.mjs';
import ApiUserController from '../../controllers/apiUserController.mjs';
import HomeController from '../../controllers/homeController.mjs';
import CartController from '../../controllers/cartController.mjs';

const router = express.Router();

// User APIs
router.get('/users', ApiUserController.index);
router.get('/users/:id', ApiUserController.show);
router.delete('/users/:id', ApiUserController.destroy);
router.post('/users', ApiUserController.create);

// Auth APIs
router.post('/register', HomeController.apiCreateSignup);
router.post('/login', HomeController.apiCreateLogin);
router.get('/me', isAuthenticated, async (req, res) => {
  res.json({ user: req.user });
});
// Product APIs
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const result = await ProductService.getProducts({ page, limit, search, category });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/products/:id', async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart APIs
router.get('/cart', isAuthenticated, CartController.viewCartApi);
router.post('/cart/add', isAuthenticated, CartController.addToCart);
router.put('/cart/update', isAuthenticated, CartController.updateQuantity);
router.delete('/cart/remove', isAuthenticated, CartController.removeFromCart);

// Checkout APIs
router.get('/history', isAuthenticated, getOrderHistoryApi);
router.get('/history/:id', isAuthenticated, getOrderDetailApi);
router.post('/checkout', isAuthenticated, createCheckoutApi);
router.post('/history/:id/cancel', isAuthenticated, cancelOrder);

// Blog APIs
router.get('/blogs', getBlogsAPI);
router.get('/blogs/:id', getBlogDetailAPI);

// Admin JSON APIs (Users)
router.get('/admin/users', isAuthenticated, isAdmin, listUsers);
router.post('/admin/users', isAuthenticated, isAdmin, createUser);
router.get('/admin/users/:id', isAuthenticated, isAdmin, getUser);
router.put('/admin/users/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/admin/users/:id', isAuthenticated, isAdmin, deleteUser);

// Admin JSON APIs (Products)
router.get('/admin/products', isAuthenticated, isAdmin, listProducts);
router.post('/admin/products', isAuthenticated, isAdmin, upload.single('image'), createProduct);
router.get('/admin/products/:id', isAuthenticated, isAdmin, getProduct);
router.put('/admin/products/:id', isAuthenticated, isAdmin, upload.single('image'), updateProduct);
router.delete('/admin/products/:id', isAuthenticated, isAdmin, deleteProduct);

// Admin JSON APIs (Blogs)
router.get('/admin/blogs', isAuthenticated, isAdmin, listBlogs);
router.post('/admin/blogs', isAuthenticated, isAdmin, upload.single('image'), createBlog);
router.get('/admin/blogs/:id', isAuthenticated, isAdmin, getBlog);
router.put('/admin/blogs/:id', isAuthenticated, isAdmin, upload.single('image'), updateBlog);
router.delete('/admin/blogs/:id', isAuthenticated, isAdmin, deleteBlog);

export default router;
