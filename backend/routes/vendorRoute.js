import express from "express";
import {
  vendorSignUp,
  vendorSignIn,
  vendorSignOut,
} from "../controllers/vendorControllers/vendorAuthController.js";
import {
  getVendorProfile,
  updateVendorProfile,
  addVehicle,
  getVendorVehicles,
  updateVehicle,
  deleteVehicle,
  getVendorBookings,
} from "../controllers/vendorControllers/vendorController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadVehicle } from "../utils/cloudinaryConfig.js";

const router = express.Router();

// Auth routes — no token needed
router.post("/signup", vendorSignUp);
router.post("/signin", vendorSignIn);
router.post("/signout", verifyToken, vendorSignOut);

// Profile routes — token needed
router.get("/profile", verifyToken, getVendorProfile);
router.put("/update", verifyToken, updateVendorProfile);

// Vehicle routes — token needed
router.post("/add-vehicle", verifyToken, uploadVehicle.array("images", 5), addVehicle);
router.get("/vehicles", verifyToken, getVendorVehicles);
router.put("/vehicle/:id", verifyToken, updateVehicle);
router.delete("/vehicle/:id", verifyToken, deleteVehicle);

// Booking routes — token needed
router.get("/bookings", verifyToken, getVendorBookings);

export default router;