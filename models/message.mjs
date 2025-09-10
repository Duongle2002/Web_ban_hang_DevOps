import mongoose from 'mongoose';

// Định nghĩa schema cho Message
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Xuất model trực tiếp từ mongoose
export default mongoose.model('Message', messageSchema);
