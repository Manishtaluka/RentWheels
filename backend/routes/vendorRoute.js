import express from "express";
import {
  vendorSignUp,
  vendorSignIn,
  vendorSignOut,
} from "../controllers/vendorControllers/vendorAuthController.js";
import {
  getVendorProfile,
  updateVendorProfile,
  updateVendorPassword,
  updateVendorPicture,
  deleteVendor,
  addVehicle,
  getVendorVehicles,
  updateVehicle,
  deleteVehicle,
  getVendorBookings,
} from "../controllers/vendorControllers/vendorController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadVehicle, uploadProfile } from "../utils/cloudinaryConfig.js"; // ✅ added uploadProfile

const router = express.Router();

// Auth routes
router.post("/signup", vendorSignUp);
router.post("/signin", vendorSignIn);
router.post("/signout", verifyToken, vendorSignOut);

// Profile routes
router.get("/profile", verifyToken, getVendorProfile);
router.put("/update", verifyToken, updateVendorProfile);
router.put("/update-password", verifyToken, updateVendorPassword);
router.put("/update-picture", verifyToken, uploadProfile.single("image"), updateVendorPicture);
router.delete("/delete", verifyToken, deleteVendor);

// Vehicle routes
router.post("/add-vehicle", verifyToken, uploadVehicle.array("images", 5), addVehicle);
router.get("/vehicles", verifyToken, getVendorVehicles);
router.put("/vehicle/:id", verifyToken, updateVehicle);
router.delete("/vehicle/:id", verifyToken, deleteVehicle);

// Booking routes
router.get("/bookings", verifyToken, getVendorBookings);

export default router;