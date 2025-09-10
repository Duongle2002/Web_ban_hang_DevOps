import mongoose from 'mongoose';

// Định nghĩa schema cho Blog
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
});

// Xuất model trực tiếp từ mongoose
export default mongoose.model('Blog', blogSchema);
