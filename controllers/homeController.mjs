import UserService from '../services/UserService.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class HomeController {
  static index(req, res) {
    res.render('index', { title: 'Home Page', user: req.user });
  }

  static login(req, res) {
    res.render('login', { title: 'Login', error: null, user: req.user });
  }

  static async createLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.login({ email, password });
      const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, 'demoDA', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
      res.redirect('/');
    } catch (error) {
      res.render('login', { title: 'Login', error: error.message, user: req.user });
    }
  }

  static signup(req, res) {
    res.render('signup', { title: 'Signup', error: null, user: req.user });
  }

  static async createSignup(req, res) {
    try {
      const { name, email, password, confirmpasword } = req.body;
      if (password !== confirmpasword) throw new Error('Passwords do not match');
      await UserService.signup({ name, email, password });
      res.redirect('/login');
    } catch (error) {
      res.render('signup', { title: 'Signup', error: error.message, user: req.user });
    }
  }

  static async apiCreateSignup(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await UserService.signup({ name, email, password });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async apiCreateLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.login({ email, password });
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        'demoDA',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: 'Đăng nhập thành công',
        token: token, // Thay 'accessToken' bằng 'token'
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

export default HomeController;