const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  commission: {
    type: Number,
    default: 10,
    min: [0, 'Commission cannot be negative'],
    max: [50, 'Commission cannot exceed 50%']
  },
  totalSales: {
    type: Number,
    default: 0,
    min: [0, 'Total sales cannot be negative']
  },
  productsCount: {
    type: Number,
    default: 0,
    min: [0, 'Products count cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  bankDetails: {
    accountNumber: String,
    routingNumber: String,
    bankName: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);