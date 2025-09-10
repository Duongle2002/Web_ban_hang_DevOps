import Checkout from '../models/checkout.mjs';
import Cart from '../models/cart.mjs';
class CheckoutService {
  static async createCheckout(userId, shippingInfo) {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    const checkoutItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    const totalPrice = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    const newCheckout = new Checkout({
      userId,
      products: checkoutItems,
      totalPrice,
      shippingInfo,
      paymentMethod: shippingInfo.payment,
      statusHistory: [{ status: 'Pending' }],
    });
    await newCheckout.save();
    await Cart.findOneAndDelete({ userId });
    return newCheckout;
  }

  static async getOrderHistory(userId, page, limit, search) {
    const skip = (page - 1) * limit;
    let query = { userId };
    if (search) {
      query.$or = [
        { _id: search },
        { 'shippingInfo.firstname': { $regex: search, $options: 'i' } },
        { 'shippingInfo.lastname': { $regex: search, $options: 'i' } },
      ];
    }
    const totalOrders = await Checkout.countDocuments(query);
    const orders = await Checkout.find(query)
      .populate('products.productId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return { orders, totalPages: Math.ceil(totalOrders / limit) };
  }

  static async getOrderDetail(userId, orderId) {
    return Checkout.findOne({ _id: orderId, userId }).populate('products.productId');
  }

  static async cancelOrder(userId, orderId) {
    const order = await Checkout.findOne({ _id: orderId, userId });
    if (!order) throw new Error('Order not found');
    if (order.status !== 'Pending') throw new Error('Only Pending orders can be cancelled');
    order.status = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled' });
    await order.save();
    return order;
  }
}

export default CheckoutService;
