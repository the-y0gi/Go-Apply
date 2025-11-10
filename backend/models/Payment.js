const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Razorpay details
  razorpayOrderId: {
    type: String,
    required: true
  },
  
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'refunded'],
    default: 'created'
  },
  
  paymentMethod: String, // card, upi, netbanking, wallet
  
  // Payment method details
  methodDetails: {
    card: {
      last4: String,
      network: String,
      type: String // credit, debit
    },
    upi: {
      vpa: String // Virtual Payment Address
    },
    wallet: {
      type: String // paytm, phonepe, etc.
    }
  },
  
  description: String,
  
  paidAt: Date,
  
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    razorpayRefundId: String
  },
  
  // Metadata
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1 });
paymentSchema.index({ applicationId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);