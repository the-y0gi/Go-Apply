const User = require("../models/User");
const notificationService = require("../services/notificationService");
const { generateToken } = require("../utils/generateToken");
const { sendWelcomeEmail, sendOtpEmail } = require("../utils/emailService");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.register = async ({ email, password, firstName, lastName }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.status = 400;
    throw error;
  }

  const user = new User({
    email,
    passwordHash: password,
    firstName,
    lastName,
  });

  await user.save();
  const token = generateToken(user._id);

  // sendWelcomeEmail(user).catch(console.error);

  // Create welcome notification
  await notificationService.createNotification(
    user._id,
    "welcome",
    "Welcome to GoApply!",
    "Complete your profile to start your study abroad journey"
  );
  
  return {
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileCompleted: user.profileCompleted,
        registrationStep: user.registrationStep,
      },
      token,
    },
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user)
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });

  if (!user.isActive)
    throw Object.assign(new Error("Account has been deactivated"), {
      status: 401,
    });

  const isPasswordValid = await user.checkPassword(password);
  if (!isPasswordValid)
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });

  const token = generateToken(user._id);

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileCompleted: user.profileCompleted,
        registrationStep: user.registrationStep,
      },
      token,
    },
  };
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.updateProfile = async (userId, data) => {
  const { firstName, lastName, phone } = data;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, ...(phone && { phone }) },
    { new: true, runValidators: true }
  );
  return updatedUser;
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: true,
      message: "If that email exists, an OTP has been sent.",
    };
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordOtp = hashedOtp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(user.email, otp);

  return {
    success: true,
    message: "OTP sent to registered email.",
  };
};

exports.verifyResetOtp = async (email, otp) => {
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordOtp: hashedOtp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw { status: 400, message: "Invalid or expired OTP." };
  }

  return { success: true, message: "OTP verified successfully." };
};

exports.resetPassword = async (email, otp, newPassword) => {
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordOtp: hashedOtp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw { status: 400, message: "Invalid or expired OTP." };
  }

  user.passwordHash = newPassword;

  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    success: true,
    message:
      "Password reset successfully. You can now log in with your new password.",
  };
};

exports.updateProfilePicture = async (userId, profilePictureUrl) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Update profile picture service error:', error);
    throw error;
  }
};