import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';

class CartService {
  static async getCart(userId) {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return { items: [], subtotal: 0 };
    const items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      total: item.productId.price * item.quantity,
    }));
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    return { items, subtotal };
  }

  static async addToCart(userId, productId, quantity) {
    console.log('Adding to cart:', { userId, productId, quantity });
  
    // Chuẩn hóa productId
    const productIdStr = productId.toString().trim();
  
    const product = await Product.findById(productIdStr);
    if (!product) {
      throw new Error('Product not found');
    }
  
    // Bước 1: Kiểm tra xem giỏ hàng có tồn tại không, nếu không thì tạo mới
    let cart = await Cart.findOneAndUpdate(
      { userId },
      { $setOnInsert: { items: [], subtotal: 0 } },
      { upsert: true, new: true }
    );
  
    // Bước 2: Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const itemExists = cart.items.some(item => item.productId.toString().trim() === productIdStr);
  
    if (itemExists) {
      // Nếu sản phẩm đã tồn tại, tăng quantity
      cart = await Cart.findOneAndUpdate(
        { userId },
        { $inc: { "items.$[elem].quantity": quantity } },
        { new: true, arrayFilters: [{ "elem.productId": productIdStr }] }
      );
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới vào items
      cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $push: {
            items: { productId: productIdStr, quantity, price: product.price }
          }
        },
        { new: true }
      );
    }
  
    // Bước 3: Tính lại subtotal
    cart.subtotal = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    await cart.save();
    console.log('Cart updated:', cart);
    return cart;
  }

  static async updateQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = parseInt(quantity);
      await cart.save();
    } else {
      throw new Error('Product not in cart');
    }
    return this.getCart(userId);
  }

  static async removeFromCart(userId, productId) {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');
    return this.getCart(userId);
  }
}

export default CartService;
