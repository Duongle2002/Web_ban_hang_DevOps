import CartService from '../services/CartService.mjs';

class CartController {
  static async viewCart(req, res) {
    if (!req.user || !req.user.id) {
      return res.redirect('/login');
    }
    try {
      const cart = await CartService.getCart(req.user.id);
      res.render('cart', { cart, subtotal: cart.subtotal, user: req.user });
    } catch (error) {
      console.error('Error viewing cart:', error);
      res.status(500).send('Error loading cart');
    }
  }

  static async viewCartApi(req, res) {
    try {
      const cart = await CartService.getCart(req.user.id);
      res.status(200).json({ message: 'Cart retrieved successfully', cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await CartService.addToCart(req.user.id, productId, quantity);
      res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
      console.error('Add to Cart error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await CartService.updateQuantity(req.user.id, productId, quantity);
      res.status(200).json({ message: 'Quantity updated successfully', cart });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { productId } = req.body;
      const cart = await CartService.removeFromCart(req.user.id, productId);
      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ message: 'Error removing product from cart' });
    }
  }
}

export default CartController;