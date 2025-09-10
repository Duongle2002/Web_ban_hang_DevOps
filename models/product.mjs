import mongoose from 'mongoose';

// Định nghĩa schema cho Product
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  image: { type: String, required: true, trim: true },
  sale: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
});

// Kiểm tra xem model đã tồn tại chưa, nếu chưa thì định nghĩa
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
