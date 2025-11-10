// const express = require('express');
// const User = require('../models/User');
// const passport = require("passport");
// require("../config/passport");

// const { generateToken } = require('../utils/generateToken');
// const { sendWelcomeEmail } = require('../utils/emailService');
// const { validateRegistration, validateLogin } = require('../middleware/validation');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// //Register user
// router.post('/register', validateRegistration, async (req, res) => {
//   try {
//     const { email, password, firstName, lastName } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create new user
//     const user = new User({
//       email,
//       passwordHash: password,
//       firstName,
//       lastName
//     });

//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     // Send welcome email (async - don't wait for it)
//     // sendWelcomeEmail(user).catch(console.error);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           profileCompleted: user.profileCompleted,
//           registrationStep: user.registrationStep
//         },
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// //Login user
// router.post('/login', validateLogin, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email }).select('+passwordHash');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Check if user is active
//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'Account has been deactivated'
//       });
//     }

//     // Check password
//     const isPasswordValid = await user.checkPassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           profileCompleted: user.profileCompleted,
//           registrationStep: user.registrationStep
//         },
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // verify token and return user
// router.get("/me", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     res.json({
//       success: true,
//       data: { user }
//     });
//   } catch (error) {
//     console.error("Auth me error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user info",
//     });
//   }
// });

// //Get user profile
// router.get('/profile', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     res.json({
//       success: true,
//       data: {
//         user
//       }
//     });

//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching profile'
//     });
//   }
// });

// // Update user profile
// router.put('/profile', protect, async (req, res) => {
//   try {
//     const { firstName, lastName, phone } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         firstName,
//         lastName,
//         ...(phone && { phone })
//       },
//       { new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: {
//         user
//       }
//     });

//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating profile'
//     });
//   }
// });

// // Logout user (for token-based auth, this is mostly handled client-side)
// router.post('/logout', protect, (req, res) => {
//   res.json({
//     success: true,
//     message: 'Logged out successfully'
//   });
// });

// // Social Auth Routes
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// // Google callback route
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = req.user?.token;

//     if (!token) {
//       console.error("Google auth: missing token");
//       return res.redirect("http://localhost:3000/social-login?error=missing_token");
//     }

//     res.redirect(`http://localhost:3000/social-login?token=${token}`);
//   }
// );

// // Facebook auth routes
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// // Facebook callback route
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   (req, res) => {
//     const token = req.user?.token;

//     if (!token) {
//       console.error("Facebook auth: missing token");
//       return res.redirect("http://localhost:3000/social-login?error=missing_token");
//     }

//     res.redirect(`http://localhost:3000/social-login?token=${token}`);
//   }
// );

// module.exports = router;

const express = require("express");
const passport = require("passport");
require("../config/passport");

const { protect } = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getMe,
  logoutUser,
  googleCallback,
  facebookCallback,
    forgotPassword,
  verifyResetOtp,
  resetPassword,

} = require("../controllers/authController");

const router = express.Router();

router.use(passport.initialize());

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getMe);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/logout", protect, logoutUser);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookCallback
);


// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
