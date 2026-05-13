import Vendor from "../../models/vendorModel.js";
import Vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/bookingModel.js";
import { errorHandler } from "../../utils/error.js";
import { uploadToCloudinary } from "../../utils/cloudinaryConfig.js";

// =====================
// GET VENDOR PROFILE
// =====================
export const getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) {
      return next(errorHandler(404, "Vendor not found"));
    }
    const { password, refreshToken, ...vendorData } = vendor._doc;
    res.status(200).json(vendorData);
  } catch (error) {
    next(error);
  }
};

// =====================
// UPDATE VENDOR PROFILE
// =====================
export const updateVendorProfile = async (req, res, next) => {
  try {
    const { username, email, phoneNumber } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      { $set: { username, email, phoneNumber } },
      { new: true }
    );

    if (!updatedVendor) {
      return next(errorHandler(404, "Vendor not found"));
    }

    const { password, refreshToken, ...vendorData } = updatedVendor._doc;
    res.status(200).json(vendorData);
  } catch (error) {
    next(error);
  }
};

// =====================
// ADD VEHICLE
// =====================
export const addVehicle = async (req, res, next) => {
  try {
    const {
      brand,
      model,
      type,
      pricePerDay,
      location,
      fuelType,
      seats,
      transmission,
    } = req.body;

    // Upload images to cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "vehicles");
        imageUrls.push(result.secure_url);
      }
    }

    const newVehicle = new Vehicle({
      brand,
      model,
      type,
      pricePerDay,
      location,
      fuelType,
      seats,
      transmission,
      images: imageUrls,
      vendorId: req.user.id,
      isApproved: false, // admin must approve
    });

    await newVehicle.save();
    res.status(201).json({
      message: "Vehicle added successfully. Waiting for admin approval.",
      vehicle: newVehicle,
    });

  } catch (error) {
    next(error);
  }
};

// =====================
// GET VENDOR VEHICLES
// =====================
export const getVendorVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ vendorId: req.user.id });
    res.status(200).json(vehicles);
  } catch (error) {
    next(error);
  }
};

// =====================
// UPDATE VEHICLE
// =====================
export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Make sure this vehicle belongs to this vendor
    const vehicle = await Vehicle.findOne({ _id: id, vendorId: req.user.id });
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found or not yours"));
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedVehicle);
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

    // Make sure this vehicle belongs to this vendor
    const vehicle = await Vehicle.findOne({ _id: id, vendorId: req.user.id });
    if (!vehicle) {
      return next(errorHandler(404, "Vehicle not found or not yours"));
    }

    await Vehicle.findByIdAndDelete(id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// =====================
// GET VENDOR BOOKINGS
// =====================
export const getVendorBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $match: { vendorId: req.user.id }
      },
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
      { $unwind: "$vehicleDetails" },
      { $unwind: "$userDetails" },
    ]);

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};