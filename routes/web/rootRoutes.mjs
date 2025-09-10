import express from 'express';
import { getUserFromToken } from '../../middleware/authMiddleware.mjs';
import HomeController from '../../controllers/homeController.mjs';

const router = express.Router();

router.get('/', getUserFromToken, HomeController.index);
router.get('/login', getUserFromToken, HomeController.login);
router.post('/login', HomeController.createLogin);
router.get('/signup', getUserFromToken, HomeController.signup);
router.post('/signup', HomeController.createSignup);
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

export default router;