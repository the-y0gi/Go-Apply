// const nodemailer = require('nodemailer');

// // Create transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// // Verify transporter configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Email transporter error:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// // Send welcome email
// const sendWelcomeEmail = async (user) => {
//   console.log('Preparing to send welcome email to:', user.email);
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: user.email,
//     subject: 'Welcome to GoApply!',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2563eb;">Welcome to GoApply, ${user.firstName}!</h2>
//         <p>Thank you for registering with GoApply. We're excited to help you with your study abroad journey.</p>
//         <p>Your account has been successfully created and you can now start exploring programs and universities.</p>
//         <div style="margin: 30px 0;">
//           <a href="${process.env.CLIENT_URL}/dashboard" 
//              style="background-color: #2563eb; color: white; padding: 12px 24px; 
//                     text-decoration: none; border-radius: 6px; display: inline-block;">
//             Go to Dashboard
//           </a>
//         </div>
//         <p>Best regards,<br>The GoApply Team</p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Welcome email sent to:', user.email);
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//   }
// };

// // Email helper functions
// const sendContactConfirmation = async (contact) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: contact.email,
//     subject: 'Thank You for Contacting GoApply!',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #2563eb;">Hello ${contact.name}!</h2>
        
//         <p>Thank you for your interest in GoApply. We have received your request for a <strong>Free Consultation</strong> and will contact you within <strong>24 hours</strong>.</p>
        
//         <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//           <h3 style="color: #374151; margin-top: 0;">Your Consultation Details:</h3>
//           <p><strong>Preferred Country:</strong> ${contact.preferredCountry}</p>
//           <p><strong>Study Goals:</strong> ${contact.studyGoals}</p>
//           ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
//         </div>

//         <div style="background: #dcfce7; padding: 15px; border-radius: 6px; margin: 20px 0;">
//           <h4 style="color: #166534; margin-top: 0;">🎯 What to Expect Next:</h4>
//           <ul>
//             <li>Expert guidance from our study abroad consultants</li>
//             <li>Personalized university recommendations</li>
//             <li>Application process overview</li>
//             <li>Scholarship and funding options</li>
//           </ul>
//         </div>

//         <p>If you have any immediate questions, feel free to reply to this email.</p>
        
//         <p>Best regards,<br>
//         <strong>The GoApply Team</strong></p>
        
//         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
//           <p>GoApply - Your Study Abroad Journey Starts Here</p>
//         </div>
//       </div>
//     `
//   };

//   await sendEmail(mailOptions);
// };

// // Admin notification for new contact
// const sendAdminNotification = async (contact) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: process.env.ADMIN_EMAIL || 'admin@goapply.com',
//     subject: `New Consultation Request: ${contact.name}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #dc2626;">New Consultation Request</h2>
        
//         <div style="background: #fef2f2; padding: 20px; border-radius: 8px;">
//           <h3>Contact Details:</h3>
//           <p><strong>Name:</strong> ${contact.name}</p>
//           <p><strong>Email:</strong> ${contact.email}</p>
//           <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
//           <p><strong>Preferred Country:</strong> ${contact.preferredCountry}</p>
//           <p><strong>Consultation Type:</strong> ${contact.consultationType}</p>
          
//           <h4>Study Goals:</h4>
//           <p style="background: white; padding: 10px; border-radius: 4px;">${contact.studyGoals}</p>
//         </div>

//         <p><strong>Response Time:</strong> 24 hours guaranteed</p>
        
//         <div style="margin-top: 20px;">
//           <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" 
//              style="background-color: #2563eb; color: white; padding: 10px 20px; 
//                     text-decoration: none; border-radius: 6px; display: inline-block;">
//             View in Dashboard
//           </a>
//         </div>
//       </div>
//     `
//   };

//   await sendEmail(mailOptions);
// };

// module.exports = {
//   transporter,
//   sendWelcomeEmail,
//   sendContactConfirmation,
//   sendAdminNotification
// };


const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Generic email sender
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📨 Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

//Send welcome email
const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"GoApply" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Welcome to GoApply!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to GoApply, ${user.firstName}!</h2>
        <p>Thank you for registering with GoApply. We're excited to help you with your study abroad journey.</p>
        <p>Your account has been successfully created and you can now start exploring programs and universities.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>Best regards,<br>The GoApply Team</p>
      </div>
    `
  };

  await sendEmail(mailOptions);
};

//Contact form submission confirmation email
const sendContactConfirmation = async (contact) => {
  const mailOptions = {
    from: `"GoApply" <${process.env.EMAIL_FROM}>`,
    to: contact.email,
    subject: 'Thank You for Contacting GoApply!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hello ${contact.name}!</h2>
        <p>Thank you for your interest in GoApply. We have received your request for a <strong>Free Consultation</strong> and will contact you within <strong>24 hours</strong>.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your Consultation Details:</h3>
          <p><strong>Preferred Country:</strong> ${contact.preferredCountry}</p>
          <p><strong>Study Goals:</strong> ${contact.studyGoals}</p>
          ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        </div>
        <div style="background: #dcfce7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #166534; margin-top: 0;">🎯 What to Expect Next:</h4>
          <ul>
            <li>Expert guidance from our study abroad consultants</li>
            <li>Personalized university recommendations</li>
            <li>Application process overview</li>
            <li>Scholarship and funding options</li>
          </ul>
        </div>
        <p>If you have any immediate questions, feel free to reply to this email.</p>
        <p>Best regards,<br><strong>The GoApply Team</strong></p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>GoApply - Your Study Abroad Journey Starts Here</p>
        </div>
      </div>
    `
  };

  await sendEmail(mailOptions);
};

//Admin notification for new contact
const sendAdminNotification = async (contact) => {
  const mailOptions = {
    from: `"GoApply" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL || 'admin@goapply.com',
    subject: `New Consultation Request: ${contact.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Consultation Request</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px;">
          <h3>Contact Details:</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
          <p><strong>Preferred Country:</strong> ${contact.preferredCountry}</p>
          <p><strong>Consultation Type:</strong> ${contact.consultationType}</p>
          <h4>Study Goals:</h4>
          <p style="background: white; padding: 10px; border-radius: 4px;">${contact.studyGoals}</p>
        </div>
        <p><strong>Response Time:</strong> 24 hours guaranteed</p>
        <div style="margin-top: 20px;">
          <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin'}" 
             style="background-color: #2563eb; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
      </div>
    `
  };

  await sendEmail(mailOptions);
};



// Send OTP Email Helper
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"GoApply Support" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Password Reset OTP - GoApply",
    html: `
      <p>Use the OTP below to reset your password. It will expire in 10 minutes.</p>
      <h2>${otp}</h2>
      <p>If you did not request this, ignore this email.</p>
    `,
  };

  await sendEmail(mailOptions);
};

module.exports = {
  transporter,
  sendEmail,
  sendWelcomeEmail,
  sendContactConfirmation,
  sendAdminNotification,
  sendOtpEmail
};
