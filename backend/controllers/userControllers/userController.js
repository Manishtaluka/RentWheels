import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";
import bcryptjs from "bcryptjs";
import { uploadToCloudinary } from "../../utils/cloudinaryConfig.js";
import Vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/bookingModel.js";
import mongoose from "mongoose";
// =====================
// GET USER PROFILE
// =====================
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, refreshToken, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// =====================
// UPDATE USER PROFILE
// =====================
export const updateUser = async (req, res, next) => {
  try {
    const { username, email, phoneNumber, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { username, email, phoneNumber, address } },
      { new: true }
    );
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, refreshToken, ...userData } = updatedUser._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// =====================
// UPDATE PASSWORD
// =====================
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(currentPassword, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Current password is wrong"));
    }
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, {
      $set: { password: hashedPassword },
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// UPDATE PROFILE PICTURE
// =====================
export const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image provided"));
    }
    const result = await uploadToCloudinary(req.file.buffer, "profiles");
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePicture: result.secure_url } },
      { new: true }
    );
    const { password, refreshToken, ...userData } = updatedUser._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// =====================
// DELETE USER ACCOUNT
// =====================
export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};


// =====================
// GET ALL APPROVED VEHICLES (public)
// =====================
export const getAllVehicles = async (req, res, next) => {
  try {
    const { search, type, location } = req.query;

    // Build filter
    const filter = { isApproved: true, isAvailable: true };

    if (type && type !== "All") {
      filter.type = type;
    }

    if (location && location !== "All") {
      filter.location = location;
    }

    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    const vehicles = await Vehicle.find(filter);
    res.status(200).json(vehicles);

  } catch (error) {
    next(error);
  }
};





// =====================
// GET SINGLE VEHICLE
// =====================
export const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id).populate(
      "vendorId",
      "username email phoneNumber"
    );
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

// =====================
// CREATE BOOKING
// =====================
export const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }

    if (!vehicle.isAvailable) {
      return next(errorHandler(400, "Vehicle is not available"));
    }

    // Calculate total days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return next(errorHandler(400, "Invalid dates selected"));
    }

    const totalAmount = days * vehicle.pricePerDay;

    // Create booking
    const newBooking = new Booking({
      userId: req.user.id,
      vehicleId,
      vendorId: vehicle.vendorId,
      startDate,
      endDate,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });

  } catch (error) {
    next(error);
  }
};

// =====================
// GET USER BOOKINGS
// =====================
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      { $unwind: "$vehicleDetails" },
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};