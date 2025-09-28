const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required')
];

const updateOrderStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// All routes require authentication
router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', authorize('customer'), createOrderValidation, handleValidationErrors, createOrder);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatusValidation, handleValidationErrors, updateOrderStatus);

module.exports = router;