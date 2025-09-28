const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

// All cart routes require authentication and customer role
router.use(protect, authorize('customer'));

router.get('/', getCart);
router.post('/add', addToCartValidation, handleValidationErrors, addToCart);
router.put('/update', updateCartValidation, handleValidationErrors, updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;