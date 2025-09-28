const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect); // All routes below require authentication
router.post('/', authorize('vendor', 'admin'), productValidation, handleValidationErrors, createProduct);
router.put('/:id', authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authorize('vendor', 'admin'), deleteProduct);

module.exports = router;