import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import vendorRoute from "./routes/vendorRoute.js";
import adminRoute from "./routes/adminRoute.js";  // ✅ add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://rent-wheels-chi.vercel.app/"], // ✅ add your frontend URL here
  credentials: true,
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/admin", adminRoute);  // ✅ add this

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ success: false, message, statusCode });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});