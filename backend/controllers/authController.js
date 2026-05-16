import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

import { sendEmail } from "../utils/sendEmail.js";


// =====================
// SIGN UP
// =====================
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "Email already in use"));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isUser: true,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    next(error);
  }
};

// =====================
// SIGN IN
// =====================
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    // Create access token (expires in 15 minutes)
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Create refresh token (expires in 7 days)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Save refresh token in database
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Remove password from response
    const { password: hashedPassword, ...userData } = user._doc;

    res.status(200).json({
      ...userData,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    next(error);
  }
};

// =====================
// SIGN OUT
// =====================
export const signOut = async (req, res, next) => {
  try {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user.id, { refreshToken: "" });
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// REFRESH TOKEN
// =====================
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(errorHandler(401, "No refresh token provided"));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandler(403, "User not found"));
    }

    // Check if refresh token matches
    if (user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    // Create new tokens
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    next(errorHandler(403, "Invalid or expired refresh token"));
  }
};


// =====================
// GOOGLE OAUTH
// =====================
export const googleAuth = async (req, res, next) => {
  const { email, name, picture } = req.body;

  try {
    if (!email) return next(errorHandler(400, "Email is required"));

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: picture,
        isUser: true,
      });
      await user.save();
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, { refreshToken });

    const { password, refreshToken: rt, ...userData } = user._doc;

    res.status(200).json({ ...userData, accessToken, refreshToken });

  } catch (error) {
    next(errorHandler(500, "Google authentication failed"));
  }
};




// =====================
// FORGOT PASSWORD — Send OTP
// =====================
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "No account with this email"));

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      resetOtp: otp,
      resetOtpExpiry: expiry,
    });

    // Send OTP email
    await sendEmail(
      email,
      "RentWheels Password Reset OTP",
      `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #16a34a;">RentWheels Password Reset</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing: 8px; color: #16a34a;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    );

    res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    next(errorHandler(500, "Failed to send OTP"));
  }
};

// =====================
// VERIFY OTP & RESET PASSWORD
// =====================
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    // Check OTP
    if (user.resetOtp !== otp) {
      return next(errorHandler(400, "Invalid OTP"));
    }

    // Check expiry
    if (new Date() > user.resetOtpExpiry) {
      return next(errorHandler(400, "OTP has expired"));
    }

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    // Update password and clear OTP
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiry: null,
    });

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    next(errorHandler(500, "Failed to reset password"));
  }
};