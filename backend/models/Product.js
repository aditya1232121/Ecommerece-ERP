const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required']
  },
  images: [{
    type: String
  }],
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Sold count cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create SKU before saving if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

