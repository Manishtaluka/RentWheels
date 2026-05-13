import express from "express";
import {
  getUser,
  updateUser,
  updatePassword,
  updateProfilePicture,
  deleteUser,
  getAllVehicles,
  getVehicleById,      // ✅ add this
  createBooking,       // ✅ add this
  getUserBookings,     // ✅ add this
} from "../controllers/userControllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { uploadProfile } from "../utils/cloudinaryConfig.js";

const router = express.Router();

// Public routes
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);       // ✅ add this

// Protected routes
router.get("/profile", verifyToken, getUser);
router.put("/update", verifyToken, updateUser);
router.put("/update-password", verifyToken, updatePassword);
router.put("/update-picture", verifyToken, uploadProfile.single("image"), updateProfilePicture);
router.delete("/delete", verifyToken, deleteUser);
router.post("/booking", verifyToken, createBooking);      // ✅ add this
router.get("/bookings", verifyToken, getUserBookings);    // ✅ add this

export default router;