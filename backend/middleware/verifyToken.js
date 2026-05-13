import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";

// Verify if user is logged in
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(errorHandler(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(403, "Invalid or expired token"));
  }
};

// Verify if user is admin
export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) {
        return next(errorHandler(403, "Only admins can access this"));
      }
      next();
    } catch (error) {
      next(error);
    }
  });
};

// Verify if user is vendor
export const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isVendor) {
      next();
    } else {
      return next(errorHandler(403, "Only vendors can access this"));
    }
  });
};