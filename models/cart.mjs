import mongoose from 'mongoose';

// Định nghĩa schema cho Cart
const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        default: 1 
      },
    },
  ],
});

// Kiểm tra xem model đã tồn tại chưa, nếu chưa thì định nghĩa
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
