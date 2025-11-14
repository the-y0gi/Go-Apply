const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPaymentController,
  getPaymentHistory,
  getPaymentById,
  initiateRefund,
  generatePaymentReceipt
} = require('../controllers/paymentController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPaymentController);
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentById);
router.post('/:id/refund', initiateRefund);
router.get('/:id/receipt', generatePaymentReceipt);


module.exports = router;