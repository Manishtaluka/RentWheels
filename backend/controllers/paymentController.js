import Razorpay from "razorpay";
import Booking from "../models/bookingModel.js";
import Vehicle from "../models/vehicleModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================
// CREATE RAZORPAY ORDER
// =====================
export const createOrder = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    // Get vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return next(errorHandler(404, "Vehicle not found"));
    if (!vehicle.isAvailable) return next(errorHandler(400, "Vehicle not available"));

    // Calculate days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) return next(errorHandler(400, "Invalid dates"));

    const totalAmount = days * vehicle.pricePerDay;

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        vehicleId: vehicleId.toString(),
        userId: req.user.id.toString(),
        startDate,
        endDate,
        days: days.toString(),
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Failed to create payment order"));
  }
};

// =====================
// VERIFY PAYMENT & CREATE BOOKING
// =====================
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vehicleId,
      startDate,
      endDate,
      totalAmount,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return next(errorHandler(400, "Payment verification failed"));
    }

    // Get vehicle and user
    const vehicle = await Vehicle.findById(vehicleId);
    const user = await User.findById(req.user.id);

    if (!vehicle) return next(errorHandler(404, "Vehicle not found"));

    // Create booking
    const newBooking = new Booking({
      userId: req.user.id,
      vehicleId,
      vendorId: vehicle.vendorId,
      startDate,
      endDate,
      totalAmount,
      status: "confirmed", // ✅ confirmed after payment
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
    });

    await newBooking.save();

    // Calculate days for email
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Send confirmation email
    await sendEmail(
      user.email,
      "🚗 Booking Confirmed — RentWheels",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #16a34a;">Booking Confirmed! 🎉</h2>
          <p>Hi <strong>${user.username}</strong>, your booking is confirmed.</p>

          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Vehicle</td>
                <td style="padding: 8px 0; font-weight: bold;">${vehicle.brand} ${vehicle.model}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Type</td>
                <td style="padding: 8px 0;">${vehicle.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Location</td>
                <td style="padding: 8px 0;">${vehicle.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Pick Up Date</td>
                <td style="padding: 8px 0;">${new Date(startDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Drop Off Date</td>
                <td style="padding: 8px 0;">${new Date(endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Duration</td>
                <td style="padding: 8px 0;">${days} day${days > 1 ? "s" : ""}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Payment ID</td>
                <td style="padding: 8px 0; font-family: monospace;">${razorpay_payment_id}</td>
              </tr>
              <tr style="border-top: 2px solid #16a34a;">
                <td style="padding: 12px 0; color: #16a34a; font-weight: bold; font-size: 18px;">Total Paid</td>
                <td style="padding: 12px 0; color: #16a34a; font-weight: bold; font-size: 18px;">₹${totalAmount}</td>
              </tr>
            </table>
          </div>

          <p style="color: #888; font-size: 14px;">
            Thank you for choosing RentWheels. Have a great trip! 🚗
          </p>
        </div>
      `
    );

    res.status(201).json({
      message: "Payment verified and booking confirmed",
      booking: newBooking,
    });

  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Failed to verify payment"));
  }
};