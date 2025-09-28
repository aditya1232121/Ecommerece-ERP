const Product = require('../models/Product');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    // Add category filter
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Handle vendor scope
    if (req.user && req.user.role === 'vendor') {
      query.vendorId = req.user._id;
    }

    let productQuery = Product.find(query).populate('vendorId', 'name email');

    // Add sorting
    if (sort) {
      const sortBy = sort === 'price_asc' ? 'price' : 
                     sort === 'price_desc' ? '-price' :
                     sort === 'newest' ? '-createdAt' :
                     sort === 'popular' ? '-sold' : '-createdAt';
      productQuery = productQuery.sort(sortBy);
    } else {
      productQuery = productQuery.sort('-createdAt');
    }

    // Add pagination
    const skip = (page - 1) * limit;
    productQuery = productQuery.skip(skip).limit(parseInt(limit));

    const products = await productQuery;
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'name email');
    
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, tags } = req.body;

    // Set vendor ID based on user role
    let vendorId = req.user.role === 'admin' ? req.body.vendorId : req.user._id;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      vendorId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    // Update vendor products count
    await User.findByIdAndUpdate(vendorId, { $inc: { productsCount: 1 } });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check ownership (vendors can only update their own products)
    if (req.user.role === 'vendor' && product.vendorId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to update this product', 403));
    }

    const { tags, ...updateData } = req.body;
    if (tags) {
      updateData.tags = tags.split(',').map(tag => tag.trim());
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check ownership (vendors can only delete their own products)
    if (req.user.role === 'vendor' && product.vendorId.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to delete this product', 403));
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update vendor products count
    await User.findByIdAndUpdate(product.vendorId, { $inc: { productsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
