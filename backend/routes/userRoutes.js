const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['admin', 'vendor', 'customer'])
    .withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
];

// All routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUserValidation, handleValidationErrors, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
