const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (Customer)
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name price images stock');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private (Customer)
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (!product.isActive) {
      return next(new ErrorResponse('Product is not available', 400));
    }

    if (product.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return next(new ErrorResponse('Cannot add more items than available stock', 400));
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price; // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    
    // Populate cart before sending response
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private (Customer)
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return next(new ErrorResponse('Quantity must be at least 1', 400));
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price; // Update price in case it changed

    await cart.save();
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private (Customer)
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private (Customer)
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    next(error);
  }
};