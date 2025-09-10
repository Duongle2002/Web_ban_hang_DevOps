import UserService from '../services/UserService.mjs';
import ProductService from '../services/ProductService.mjs';
import BlogService from '../services/BlogService.mjs';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import validator from 'validator';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

export class adminController {
  static handleErrors(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  // User Management
  static manageUsers = this.handleErrors(async (req, res) => {
    const q = req.query.q || '';
    const users = await UserService.searchUsers(q);
    res.render('admin', { 
      title: 'User Management', 
      users, 
      q, 
      user: req.user, 
      action: req.query.action,
      error: null // Thêm error mặc định là null
    });
  });

  static createUser = this.handleErrors(async (req, res) => {
    const { email, name, age, password, role } = req.body;
    
    if (!email || !password) {
      return res.render('admin', {
        title: 'User Management',
        action: 'newUser',
        user: req.user,
        error: 'Email và password là bắt buộc'
      });
    }
    if (!validator.isEmail(email)) {
      return res.render('admin', {
        title: 'User Management',
        action: 'newUser',
        user: req.user,
        error: 'Email không hợp lệ'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserService.createUser({ 
      email, 
      name, 
      age: parseInt(age) || null, 
      password: hashedPassword, 
      role 
    });
    res.redirect('/admin/users');
  });

  static editUser = this.handleErrors(async (req, res) => {
    const editUser = await UserService.getUserById(req.params.id);
    if (!editUser) {
      return res.redirect('/admin/users');
    }
    res.render('admin', { 
      title: 'User Management', 
      action: 'editUser', 
      editUser, 
      user: req.user,
      error: null // Thêm error mặc định là null
    });
  });

  static updateUser = this.handleErrors(async (req, res) => {
    const { email, name, age, password, role } = req.body;
    if (!email) {
      return res.render('admin', {
        title: 'User Management',
        action: 'editUser',
        editUser: { email, name, age, role },
        user: req.user,
        error: 'Email là bắt buộc'
      });
    }
    if (!validator.isEmail(email)) {
      return res.render('admin', {
        title: 'User Management',
        action: 'editUser',
        editUser: { email, name, age, role },
        user: req.user,
        error: 'Email không hợp lệ'
      });
    }

    const updateData = { 
      email, 
      name, 
      age: parseInt(age) || null, 
      role 
    };
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await UserService.updateUser(req.params.id, updateData);
    res.redirect('/admin/users');
  });

  static deleteUser = this.handleErrors(async (req, res) => {
    await UserService.deleteUser(req.params.id);
    res.redirect('/admin/users');
  });

  // Product Management
  static manageProducts = this.handleErrors(async (req, res) => {
    const q = req.query.q || '';
    const products = await ProductService.searchProducts(q);
    res.render('admin', { 
      title: 'Product Management', 
      products, 
      q, 
      user: req.user, 
      action: req.query.action,
      error: null // Thêm error mặc định là null
    });
  });

  static createProduct = this.handleErrors(async (req, res) => {
    const { name, category, price, originalPrice, sale, newArrival, bestSeller } = req.body;
    if (!name || !price) {
      return res.render('admin', {
        title: 'Product Management',
        action: 'newProduct',
        user: req.user,
        error: 'Tên sản phẩm và giá là bắt buộc'
      });
    }

    const image = req.file ? `/images/${req.file.filename}` : '';
    const productData = {
      name, 
      category, 
      price: parseFloat(price), 
      originalPrice: parseFloat(originalPrice) || null,
      image,
      sale: sale === 'on',
      newArrival: newArrival === 'on',
      bestSeller: bestSeller === 'on'
    };
    await ProductService.createProduct(productData);
    res.redirect('/admin/products');
  });

  static editProduct = this.handleErrors(async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      return res.redirect('/admin/products');
    }
    res.render('admin', { 
      title: 'Product Management', 
      action: 'editProduct', 
      product, 
      user: req.user,
      error: null // Thêm error mặc định là null
    });
  });

  static updateProduct = this.handleErrors(async (req, res) => {
    const { name, category, price, originalPrice, sale, newArrival, bestSeller } = req.body;
    if (!name || !price) {
      return res.render('admin', {
        title: 'Product Management',
        action: 'editProduct',
        product: { name, category, price, originalPrice, sale, newArrival, bestSeller },
        user: req.user,
        error: 'Tên sản phẩm và giá là bắt buộc'
      });
    }

    const image = req.file ? `/images/${req.file.filename}` : req.body.existingImage;
    const productData = {
      name,
      category,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || null,
      image,
      sale: sale === 'on',
      newArrival: newArrival === 'on',
      bestSeller: bestSeller === 'on'
    };
    await ProductService.updateProduct(req.params.id, productData);
    res.redirect('/admin/products');
  });

  static deleteProduct = this.handleErrors(async (req, res) => {
    await ProductService.deleteProduct(req.params.id);
    res.redirect('/admin/products');
  });

  // Blog Management
  static manageBlogs = this.handleErrors(async (req, res) => {
    const q = req.query.q || '';
    const blogs = await BlogService.searchBlogs(q);
    res.render('admin', { 
      title: 'Blog Management', 
      blogs, 
      q, 
      user: req.user, 
      action: req.query.action,
      error: null // Thêm error mặc định là null
    });
  });

  static createBlog = this.handleErrors(async (req, res) => {
    const { title, description, content } = req.body;
    if (!title || !content) {
      return res.render('admin', {
        title: 'Blog Management',
        action: 'newBlog',
        user: req.user,
        error: 'Tiêu đề và nội dung là bắt buộc'
      });
    }

    const image = req.file ? `/images/${req.file.filename}` : '';
    await BlogService.createBlog({ title, description, image, content });
    res.redirect('/admin/blogs');
  });

  static editBlog = this.handleErrors(async (req, res) => {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) {
      return res.redirect('/admin/blogs');
    }
    res.render('admin', { 
      title: 'Blog Management', 
      action: 'editBlog', 
      blog, 
      user: req.user,
      error: null // Thêm error mặc định là null
    });
  });

  static updateBlog = this.handleErrors(async (req, res) => {
    const { title, description, content } = req.body;
    if (!title || !content) {
      return res.render('admin', {
        title: 'Blog Management',
        action: 'editBlog',
        blog: { title, description, content },
        user: req.user,
        error: 'Tiêu đề và nội dung là bắt buộc'
      });
    }

    const image = req.file ? `/images/${req.file.filename}` : req.body.existingImage;
    await BlogService.updateBlog(req.params.id, { title, description, image, content });
    res.redirect('/admin/blogs');
  });

  static deleteBlog = this.handleErrors(async (req, res) => {
    await BlogService.deleteBlog(req.params.id);
    res.redirect('/admin/blogs');
  });
}