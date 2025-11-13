const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (amount, currency = "INR") => {
  return await razorpayInstance.orders.create({
    amount: amount * 100,
    currency,
    receipt: "rcpt_" + Date.now(),
    payment_capture: 1
  });
};


exports.verifyPayment = async (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  if (expected !== signature) {
    return { success: false };
  }

  const details = await razorpayInstance.payments.fetch(paymentId);

  // SAFE NORMALIZED METHOD DETAILS
  const methodDetails = {
    card: details.card ? details.card.name || "" : "",
    upi: details.upi ? details.upi.vpa || "" : "",
    wallet: typeof details.wallet === "string" ? details.wallet : ""
  };

  return {
    success: true,
    method: details.method,
    methodDetails,
    details
  };
};
