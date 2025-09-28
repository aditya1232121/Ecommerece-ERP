const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400));
    }

    // Validate stock and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      
      if (!product.isActive) {
        return next(new ErrorResponse(`Product ${product.name} is no longer available`, 400));
      }
      
      if (product.stock < cartItem.quantity) {
        return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
        vendorId: product.vendorId
      });

      totalAmount += cartItem.quantity * cartItem.price;
    }

    // Create order
    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      notes
    });

    // Update product stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 
          stock: -item.quantity,
          sold: item.quantity
        }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order details
    await order.populate('customerId', 'name email');
    await order.populate('items.productId', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query = {};
    
    // Scope based on user role
    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'vendor') {
      query['items.vendorId'] = req.user._id;
    }
    // Admin can see all orders (no additional filter)

    const { status, page = 1, limit = 20 } = req.query;
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('items.productId', 'name images description')
      .populate('items.vendorId', 'name email');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check authorization
    if (req.user.role === 'customer' && order.customerId._id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }
    
    if (req.user.role === 'vendor') {
      const hasVendorItems = order.items.some(item => 
        item.vendorId._id.toString() === req.user._id.toString()
      );
      if (!hasVendorItems) {
        return next(new ErrorResponse('Not authorized to view this order', 403));
      }
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Vendor)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse('Invalid status', 400));
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check authorization for vendors
    if (req.user.role === 'vendor') {
      const hasVendorItems = order.items.some(item => 
        item.vendorId.toString() === req.user._id.toString()
      );
      if (!hasVendorItems) {
        return next(new ErrorResponse('Not authorized to update this order', 403));
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    next(error);
  }
};
