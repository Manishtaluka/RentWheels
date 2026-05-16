import express from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  googleAuth,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", verifyToken, signOut);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);

export default router;