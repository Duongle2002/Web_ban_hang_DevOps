// router.mjs
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/authMiddleware.mjs';
import { adminController, upload } from '../../controllers/adminController.mjs';

const router = express.Router();

// User Routes
router.get('/users', isAuthenticated, isAdmin, adminController.manageUsers);
router.post('/users/create', isAuthenticated, isAdmin, adminController.createUser);
router.get('/users/edit/:id', isAuthenticated, isAdmin, adminController.editUser);
router.post('/users/update/:id', isAuthenticated, isAdmin, adminController.updateUser);
router.post('/users/delete/:id', isAuthenticated, isAdmin, adminController.deleteUser);

// Product Routes
router.get('/products', isAuthenticated, isAdmin, adminController.manageProducts);
router.post('/products/create', isAuthenticated, isAdmin, upload.single('image'), adminController.createProduct);
router.get('/products/edit/:id', isAuthenticated, isAdmin, adminController.editProduct);
router.post('/products/update/:id', isAuthenticated, isAdmin, upload.single('image'), adminController.updateProduct);
router.post('/products/delete/:id', isAuthenticated, isAdmin, adminController.deleteProduct);

// Blog Routes
router.get('/blogs', isAuthenticated, isAdmin, adminController.manageBlogs);
router.post('/blogs/create', isAuthenticated, isAdmin, upload.single('image'), adminController.createBlog);
router.get('/blogs/edit/:id', isAuthenticated, isAdmin, adminController.editBlog);
router.post('/blogs/update/:id', isAuthenticated, isAdmin, upload.single('image'), adminController.updateBlog);
router.post('/blogs/delete/:id', isAuthenticated, isAdmin, adminController.deleteBlog);

export default router;