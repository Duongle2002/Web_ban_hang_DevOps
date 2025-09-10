import mongoose from 'mongoose';

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, minLength: 6 },
  workExperience: { type: [Object], default: [] },
  age: { type: Number },
  role: { type: String, default: 'User', enum: ['Admin', 'User'] },
});

// Xuất model trực tiếp từ mongoose
export default mongoose.model('User', userSchema);
