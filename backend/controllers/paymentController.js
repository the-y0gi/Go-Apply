const Payment = require('../models/Payment');
const Application = require('../models/Application');
const { createOrder, verifyPayment, getPaymentDetails } = require('../config/razorpay');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const fs = require("fs");
const pdf = require("html-pdf");
const path = require("path");

//create payment
exports.createPaymentOrder = async (req, res) => {
  try {
    const { applicationId, amount, currency = 'INR' } = req.body;

    if (!applicationId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and amount are required'
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Razorpay order
    const order = await createOrder(amount, currency);

    // Payment record
    const payment = await Payment.create({
      userId: req.user._id,
      applicationId,
      razorpayOrderId: order.id,
      amount,
      currency,
      status: "created",
      description: `Application fee for ${application.programId?.name || 'program'}`
    });

    res.json({
      success: true,
      message: "Order created",
      data: {
        order,
        payment,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const sendApplicationToCollege = async (application) => {
  try {
    const user = await User.findById(application.userId);
    const userProfile = await UserProfile.findOne({ userId: application.userId });
    const documents = await Document.find({ applicationId: application._id });

    const collegeData = {
      applicationId: application._id,
      student: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: userProfile?.phone,
        nationality: userProfile?.nationality,
        education: userProfile?.educationHistory,
        workExperience: userProfile?.experience,
        documents: documents.map(doc => ({
          type: doc.type,
          url: doc.url,
          uploadedAt: doc.uploadedAt
        }))
      },
      program: {
        name: application.programId?.name,
        degreeType: application.programId?.degreeType,
        fieldOfStudy: application.programId?.fieldOfStudy
      },
      university: {
        name: application.universityId?.name,
        country: application.universityId?.country
      },
      applicationDetails: {
        personalStatement: application.personalStatement,
        submittedAt: application.submittedAt,
        paymentStatus: "paid"
      }
    };

    //  Send to college (Choose one method)
    
    // Email to university
    // await sendEmailToUniversity(collegeData);
    
    //Store in database for admin view
    // await storeApplicationForAdmin(collegeData);
    
    // Webhook to university system
    // await sendWebhookToUniversity(collegeData);

    console.log(`Application sent to college: ${application.universityId?.name}`);

  } catch (error) {
    console.error("Error sending application to college:", error);
  }
};

exports.verifyPaymentController = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: "Missing verification data" });
    }

    const verifyResult = await verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!verifyResult.success) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: "failed" }
      );
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId, userId: req.user._id },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "paid",
        paymentMethod: verifyResult.method,
        methodDetails: verifyResult.methodDetails || {},
        paidAt: new Date(),
      },
      { new: true }
    ).populate("applicationId");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // UPDATE PROGRESS
    await Application.findByIdAndUpdate(payment.applicationId._id, {
      "progress.payment": true,
      paymentStatus: "paid"
    });

    // AUTO-SUBMIT 
    const application = await Application.findById(payment.applicationId._id)
      .populate("userId")
      .populate("universityId")
      .populate("programId");

    const requiredSteps = ["personalInfo", "academicInfo", "documents", "payment"];
    const isComplete = requiredSteps.every((step) => application.progress[step]);

    if (isComplete && application.status === "draft") {
      application.status = "submitted";
      application.submittedAt = new Date();
      await application.save();

      await sendApplicationToCollege(application);
      
      console.log(`Application ${application._id} auto-submitted to college after payment`);
    }

    res.json({
      success: true,
      message: isComplete ? "Payment verified and application submitted to college" : "Payment verified",
      data: {
        payment,
        application: {
          _id: application._id,
          status: application.status,
          progress: application.progress,
          submittedAt: application.submittedAt
        },
        paymentDetails: verifyResult.details
      }
    });

  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("applicationId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { payments }
    });

  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ success: false, message: "Error fetching history" });
  }
};

//GET PAYMENT BY ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate("applicationId");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, data: { payment } });

  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, message: "Error" });
  }
};

//REFUND
exports.initiateRefund = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: "paid"
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Not eligible for refund" });
    }

    payment.status = "refunded";
    payment.refund = {
      amount: payment.amount,
      reason: req.body.reason || "User requested",
      processedAt: new Date()
    };

    await payment.save();

    res.json({ success: true, message: "Refund initiated", data: { payment } });

  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({ success: false, message: "Error initiating refund" });
  }
};


exports.generatePaymentReceipt = async (req, res) => {
  try {
  const paymentId = req.params.id;

  // Fetch payment, user, application...
  const payment = await Payment.findById(paymentId);
  if (!payment) return res.status(404).send("Payment not found");

  const user = await User.findById(payment.userId);
 const application = await Application.findById(payment.applicationId)
  .populate("universityId")
  .populate("programId");

  // Load template file
  const templatePath = path.join(process.cwd(), "templates", "payment-receipt.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders
  html = html
        .replace("{{generated_date}}", new Date().toLocaleString())
  .replace(
    "{{user_name}}",
    user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "N/A"
  )
  .replace("{{user_email}}", user?.email || "N/A")
      // .replace("{{user_phone}}", user?.phone || "N/A")
      // .replace("{{user_address}}", user?.address || "N/A")
      .replace("{{university_name}}", application.universityId?.name || "N/A")
      .replace("{{university_country}}", application.universityId?.country || "N/A")
      .replace("{{program_name}}", application.programId?.name || "N/A")
      .replace("{{degree_type}}", application.programId?.degreeType || "N/A")
      .replace("{{order_id}}", payment.razorpayOrderId || "N/A")
      .replace("{{transaction_id}}", payment.razorpayPaymentId || "N/A")
      .replace("{{amount}}", payment.amount)
      .replace("{{currency}}", payment.currency)
      .replace("{{status}}", payment.status)
      .replace("{{paid_date}}", new Date(payment.paidAt).toLocaleString());

  // Convert to PDF
  pdf.create(html).toBuffer((err, buffer) => {
    if (err) return res.status(500).send("Error generating PDF");
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${paymentId}.pdf`
    );
    
    res.send(buffer);
  });
  } catch (error) {
    console.error("Receipt Error:", error);
    res.status(500).send("Failed to generate receipt");
  }
};