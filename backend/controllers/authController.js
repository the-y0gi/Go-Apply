const authService = require("../services/authService");

exports.registerUser = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("Auth me error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user info" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user._id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

exports.logoutUser = (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

exports.googleCallback = (req, res) => {
  const token = req.user?.token;
  if (!token) {
    console.error("Google auth: missing token");
    return res.redirect("http://localhost:3000/social-login?error=missing_token");
  }
  res.redirect(`http://localhost:3000/social-login?token=${token}`);
};

exports.facebookCallback = (req, res) => {
  const token = req.user?.token;
  if (!token) {
    console.error("Facebook auth: missing token");
    return res.redirect("http://localhost:3000/social-login?error=missing_token");
  }
  res.redirect(`http://localhost:3000/social-login?token=${token}`);
};


exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error sending OTP",
    });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyResetOtp(email, otp);
    res.status(200).json(result);
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Invalid or expired OTP",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Error resetting password",
    });
  }
};
