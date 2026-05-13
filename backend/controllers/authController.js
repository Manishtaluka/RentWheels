import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

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