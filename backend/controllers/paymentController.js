const Payment = require('../models/Payment');
const Application = require('../models/Application');
const { createOrder, verifyPayment, getPaymentDetails } = require('../config/razorpay');

//POST->   Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { applicationId, amount, currency = 'INR' } = req.body;

    if (!applicationId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and amount are required'
      });
    }

    // Verify application exists and belongs to user
    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Create Razorpay order
    const order = await createOrder(amount, currency);

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      applicationId,
      razorpayOrderId: order.id,
      amount,
      currency,
      description: `Application fee for ${application.programId?.name || 'program'}`
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt
        },
        payment: {
          id: payment._id,
          amount: payment.amount,
          currency: payment.currency
        },
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//POST->   Verify payment
const verifyPaymentController = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Verify payment signature
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId, userId: req.user._id },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
        paidAt: new Date(),
        ...(req.body.paymentMethod && { paymentMethod: req.body.paymentMethod })
      },
      { new: true }
    ).populate('applicationId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update application payment status if applicable
    if (payment.applicationId) {
      await Application.findByIdAndUpdate(payment.applicationId, {
        'progress.payment': true
      });
    }

    // Get complete payment details from Razorpay
    const paymentDetails = await getPaymentDetails(razorpayPaymentId);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: {
          ...payment.toObject(),
          paymentDetails
        }
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

//GET->   Get payment history 
const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filter = { userId: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const payments = await Payment.find(filter)
      .populate('applicationId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    // Calculate total spent
    const totalSpent = await Payment.aggregate([
      { $match: { ...filter, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          totalSpent: totalSpent[0]?.total || 0,
          totalPayments: total
        },
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
};

//GET->   Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('applicationId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: {
        payment
      }
    });

  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment'
    });
  }
};


const initiateRefund = async (req, res) => {
  try {
    const { reason } = req.body;

    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'paid'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or not eligible for refund'
      });
    }

    // Check if payment was made within refund period (e.g., 7 days)
    const paymentDate = new Date(payment.paidAt);
    const currentDate = new Date();
    const daysDiff = (currentDate - paymentDate) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      return res.status(400).json({
        success: false,
        message: 'Refund period has expired (7 days)'
      });
    }

    // In a real scenario, you would call Razorpay refund API here
    // For now, we'll just update the payment status
    payment.status = 'refunded';
    payment.refund = {
      amount: payment.amount,
      reason: reason || 'Customer request',
      processedAt: new Date()
    };
    
    await payment.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        payment
      }
    });

  } catch (error) {
    console.error('Initiate refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating refund'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentController,
  getPaymentHistory,
  getPaymentById,
  initiateRefund
};