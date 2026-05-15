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
/*app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:5173",
      "https://rent-wheels-chi.vercel.app"
    ];
    // Allow all vercel.app subdomains
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));*/
app.use(cors({
  origin: (origin, callback) => {
    // Always allow localhost for dev
    if (!origin || origin === "http://localhost:5173") {
      return callback(null, true);
    }

    // Allow your production domain
    if (origin === "https://rent-wheels-chi.vercel.app") {
      return callback(null, true);
    }

    // Allow all *.vercel.app subdomains (previews)
    if (/\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Block everything else
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests globally
app.options("*", cors());


// Handle preflight requests globally
app.options("*", cors());

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


