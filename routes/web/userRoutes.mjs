import express from 'express';
import { isAuthenticated } from '../../middleware/authMiddleware.mjs';
import UserController from '../../controllers/userController.mjs';

const router = express.Router();

router.get('/', isAuthenticated, UserController.index);
router.get('/new', isAuthenticated, UserController.new);
router.post('/create', isAuthenticated, UserController.create);
router.delete('/delete/:id', isAuthenticated, UserController.delete);

export default router;