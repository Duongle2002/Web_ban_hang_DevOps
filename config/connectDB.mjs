import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

async function connectDB() {
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database!');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB database:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
}

export default connectDB;
