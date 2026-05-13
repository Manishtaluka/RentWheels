import User from "../../models/userModel.js";
import Vendor from "../../models/vendorModel.js";
import Vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/bookingModel.js";
import { errorHandler } from "../../utils/error.js";

// =====================
// GET ALL USERS
// =====================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// =====================
// DELETE USER
// =====================
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// GET ALL VENDORS
// =====================
export const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().select("-password -refreshToken");
    res.status(200).json(vendors);
  } catch (error) {
    next(error);
  }
};

// =====================
// APPROVE VENDOR
// =====================
export const approveVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!vendor) {
      return next(errorHandler(404, "Vendor not found"));
    }
    res.status(200).json({ message: "Vendor approved successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// REJECT VENDOR
// =====================
export const rejectVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: { isApproved: false } },
      { new: true }
    );
    if (!vendor) {
      return next(errorHandler(404, "Vendor not found"));
    }
    res.status(200).json({ message: "Vendor rejected successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// DELETE VENDOR
// =====================
export const deleteVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Vendor.findByIdAndDelete(id);
    if (!deleted) {
      return next(errorHandler(404, "Vendor not found"));
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// GET ALL VEHICLES
// =====================
export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.aggregate([
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vendorDetails" },
    ]);
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

// =====================
// APPROVE VEHICLE
// =====================
export const approveVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found"));
    }
    res.status(200).json({ message: "Vehicle approved successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// DELETE VEHICLE
// =====================
export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.findByIdAndDelete(id);
    if (!deleted) {
      return next(errorHandler(404, "Vehicle not found"));
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// GET ALL BOOKINGS
// =====================
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      { $unwind: "$vehicleDetails" },
      { $unwind: "$userDetails" },
      { $unwind: "$vendorDetails" },
    ]);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// =====================
// CHANGE BOOKING STATUS
// =====================
export const changeBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid status value"));
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!booking) {
      return next(errorHandler(404, "Booking not found"));
    }

    res.status(200).json({ message: "Booking status updated successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// GET DASHBOARD STATS
// =====================
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ isApproved: false });
    const pendingVehicles = await Vehicle.countDocuments({ isApproved: false });

    res.status(200).json({
      totalUsers,
      totalVendors,
      totalVehicles,
      totalBookings,
      pendingVendors,
      pendingVehicles,
    });
  } catch (error) {
    next(error);
  }
};