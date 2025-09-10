import Product from '../models/product.mjs';

class ProductService {
  static async getProducts({ page = 1, limit = 10, search = '', category = '' } = {}) { const query = {}; if (search) query.name = { $regex: search, $options: 'i' }; if (category) query.category = category; const products = await Product.find(query) .skip((page - 1) * limit) .limit(parseInt(limit)) .exec(); const total = await Product.countDocuments(query); return { products, total, page, totalPages: Math.ceil(total / limit) }; }



  static async getProductById(id) {
    return Product.findById(id);
  }

  static async createProduct(data) {
    return Product.create(data);
  }

  static async updateProduct(id, data) {
    return Product.updateOne({ _id: id }, data);
  }

  static async deleteProduct(id) {
    return Product.deleteOne({ _id: id });
  }

  static async searchProducts(query) {
    try {
      if (!query || typeof query !== 'string') {
        return await Product.find(); // Trả về tất cả sản phẩm nếu không có query
      }
      return await Product.find({ name: { $regex: query, $options: 'i' } }); // Tìm kiếm theo tên
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  }
}

export default ProductService;
