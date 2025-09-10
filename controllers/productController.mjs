import Product from "../models/product.mjs";


const getProductPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;
  const category = req.query.category || '';
  const search = req.query.search || '';
  const sort = req.query.sort || '';
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || null;
  const status = req.query.status ? (Array.isArray(req.query.status) ? req.query.status : [req.query.status]) : [];

  try {
    console.log('Database connected:', Product.db.name);
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) query.price = { $gte: minPrice, $lte: maxPrice || Infinity };
    if (status.length > 0) {
      query.$or = [];
      if (status.includes('sale')) query.$or.push({ sale: true });
      if (status.includes('newArrival')) query.$or.push({ newArrival: true });
      if (status.includes('bestSeller')) query.$or.push({ bestSeller: true });
    }

    let sortOption = {};
    switch (sort) {
      case 'price-asc': sortOption.price = 1; break;
      case 'price-desc': sortOption.price = -1; break;
      case 'name-asc': sortOption.name = 1; break;
      case 'name-desc': sortOption.name = -1; break;
      default: sortOption.createdAt = -1;
    }

    console.log('Query:', query);
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(limit);
    console.log('Total products:', totalProducts);
    console.log('Products:', products);

    const categories = await Product.distinct("category");
    const maxPriceFromDB = (await Product.find().sort({ price: -1 }).limit(1))[0]?.price || 1000;

    const responseData = {
      categories,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      category,
      search,
      sort,
      totalProducts,
      minPrice,
      maxPrice: maxPrice || maxPriceFromDB,
      status,
      maxPriceFromDB,
      user: req.user,
    };

    // Kiểm tra nếu là yêu cầu AJAX (có header X-Requested-With: XMLHttpRequest)
    if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.json({
        products: products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
      });
    }

    console.log('Response data for render:', responseData);
    res.render("product", responseData);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm.');
    }
    res.render('single_product', { product, user: req.user });
  } catch (error) {
    res.status(500).send('Lỗi khi lấy chi tiết sản phẩm.');
  }
};

export { getProductDetail, getProductPage };
