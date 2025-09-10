import Blog from '../models/blog.mjs';

// Lấy danh sách tất cả blog
const getBlogs = async () => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }); // Sắp xếp theo ngày giảm dần
    return blogs;
  } catch (error) {
    throw new Error('Error fetching blogs: ' + error.message);
  }
};

// Lấy chi tiết blog theo ID
const getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  } catch (error) {
    throw new Error('Error fetching blog by ID: ' + error.message);
  }
};

// Tạo blog mới
const createBlog = async (blogData) => {
  try {
    const newBlog = new Blog(blogData);
    await newBlog.save();
    return newBlog;
  } catch (error) {
    throw new Error('Error creating blog: ' + error.message);
  }
};

// Tìm kiếm blog theo tiêu đề
const searchBlogs = async (query) => {
  try {
    // Nếu không có query hoặc query không phải chuỗi, trả về tất cả blog
    if (!query || typeof query !== 'string') {
      return await Blog.find().sort({ date: -1 });
    }
    // Nếu có query, tìm kiếm theo tiêu đề với $regex
    return await Blog.find({ title: { $regex: query, $options: 'i' } }).sort({ date: -1 });
  } catch (error) {
    throw new Error('Error searching blogs: ' + error.message);
  }
};

// Cập nhật blog theo ID
const updateBlog = async (id, blogData) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!updatedBlog) {
      throw new Error('Blog not found');
    }
    return updatedBlog;
  } catch (error) {
    throw new Error('Error updating blog: ' + error.message);
  }
};

// Xóa blog theo ID
const deleteBlog = async (id) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      throw new Error('Blog not found');
    }
    return deletedBlog;
  } catch (error) {
    throw new Error('Error deleting blog: ' + error.message);
  }
};

export default {
  getBlogs,
  getBlogById,
  createBlog,
  searchBlogs,
  updateBlog,
  deleteBlog,
};