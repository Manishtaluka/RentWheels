import Vendor from "../../models/vendorModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/error.js";

// =====================
// VENDOR SIGN UP
// =====================
export const vendorSignUp = async (req, res, next) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return next(errorHandler(409, "Email already in use"));
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new vendor
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      isVendor: true,
      isApproved: false, // admin must approve first
    });

    await newVendor.save();
    res.status(201).json({
      message: "Vendor account created. Wait for admin approval.",
    });

  } catch (error) {
    next(error);
  }
};

// =====================
// VENDOR SIGN IN
// =====================
export const vendorSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return next(errorHandler(404, "Vendor not found"));
    }

    // Check if approved by admin
    if (!vendor.isApproved) {
      return next(errorHandler(403, "Your account is not approved by admin yet"));
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, vendor.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    // Create tokens
    const accessToken = jwt.sign(
      { id: vendor._id, isVendor: true },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: vendor._id, isVendor: true },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Save refresh token
    await Vendor.findByIdAndUpdate(vendor._id, { refreshToken });

    // Remove password from response
    const { password: hashedPassword, refreshToken: rt, ...vendorData } = vendor._doc;

    res.status(200).json({
      ...vendorData,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    next(error);
  }
};

// =====================
// VENDOR SIGN OUT
// =====================
export const vendorSignOut = async (req, res, next) => {
  try {
    await Vendor.findByIdAndUpdate(req.user.id, { refreshToken: "" });
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};