import BlogService from '../services/BlogService.mjs';

export const getBlogPage = async (req, res) => {
  try {
    const blogs = await BlogService.getBlogs();
    const dates = [...new Set(blogs.map(blog => blog.date ? blog.date.toDateString() : 'Unknown'))];
    res.render('blog', { dates, blogs, user: req.user });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getBlogDetail = async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');
    res.render('blog-detail', { blog, user: req.user });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).send('Internal Server Error');
  }
};

// API để lấy danh sách blog
export const getBlogsAPI = async (req, res) => {
  try {
    const blogs = await BlogService.getBlogs();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs via API:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// API để lấy chi tiết blog theo ID
export const getBlogDetailAPI = async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog detail via API:', error);
    if (error.message === 'Blog not found') {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// API để tạo blog mới
export const createBlogAPI = async (req, res) => {
  try {
    const blogData = req.body;
    const newBlog = await BlogService.createBlog(blogData);
    res.status(201).json({
      success: true,
      data: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog via API:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};