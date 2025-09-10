import CheckoutService from '../services/CheckoutService.mjs';
import CartService from '../services/CartService.mjs';

export const checkOutPage = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const cart = await CartService.getCart(req.user.id);
    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart');
    }
    res.render('checkout', { cart, subtotal: cart.subtotal, user: req.user });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    res.status(500).send('Error loading checkout page');
  }
};

export const createCheckout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { firstname, lastname, phone, email, streetaddress, apartment, towncity, country, payment } = req.body;
  const requiredFields = ['firstname', 'lastname', 'phone', 'email', 'streetaddress', 'towncity', 'country', 'payment'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }
  try {
    await CheckoutService.createCheckout(req.user.id, req.body);
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error creating checkout order:', error);
    res.status(500).json({ message: 'Error creating checkout order', error: error.message });
  }
};

export const getOrderHistory = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const search = req.query.search || '';
  try {
    const { orders, totalPages } = await CheckoutService.getOrderHistory(req.user.id, page, limit, search);
    res.render('history', { orders, currentPage: page, totalPages, search, user: req.user });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).send('Error fetching order history');
  }
};

export const getOrderDetail = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const order = await CheckoutService.getOrderDetail(req.user.id, req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.render('order-detail', { order, user: req.user });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).send('Error fetching order detail');
  }
};

export const cancelOrder = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    await CheckoutService.cancelOrder(req.user.id, req.params.id);
    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderHistoryApi = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const search = req.query.search || '';
  try {
    const { orders, totalPages } = await CheckoutService.getOrderHistory(req.user.id, page, limit, search);
    res.status(200).json({ orders, currentPage: page, totalPages, search });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};

export const getOrderDetailApi = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const order = await CheckoutService.getOrderDetail(req.user.id, req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: 'Error fetching order detail', error: error.message });
  }
};

export const createCheckoutApi = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
  try {
    const checkout = await CheckoutService.createCheckout(req.user.id, req.body);
    res.status(201).json({ message: 'Đặt hàng thành công', checkout });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};
