import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllVendors,
  approveVendor,
  rejectVendor,
  deleteVendor,
  getAllVehicles,
  approveVehicle,
  deleteVehicle,
  getAllBookings,
  changeBookingStatus,
  getDashboardStats,
} from "../controllers/adminControllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// All admin routes are protected
// Dashboard
router.get("/dashboard", verifyAdmin, getDashboardStats);

// User management
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/user/:id", verifyAdmin, deleteUser);

// Vendor management
router.get("/vendors", verifyAdmin, getAllVendors);
router.put("/vendor/approve/:id", verifyAdmin, approveVendor);
router.put("/vendor/reject/:id", verifyAdmin, rejectVendor);
router.delete("/vendor/:id", verifyAdmin, deleteVendor);

// Vehicle management
router.get("/vehicles", verifyAdmin, getAllVehicles);
router.put("/vehicle/approve/:id", verifyAdmin, approveVehicle);
router.delete("/vehicle/:id", verifyAdmin, deleteVehicle);

// Booking management
router.get("/bookings", verifyAdmin, getAllBookings);
router.put("/booking/status/:id", verifyAdmin, changeBookingStatus);

export default router;