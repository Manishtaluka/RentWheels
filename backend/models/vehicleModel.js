import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true, // SUV, Sedan, Hatchback etc
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // array of image URLs from Cloudinary
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // admin must approve before listing
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // links to the vendor who owns this vehicle
      required: true,
    },
    fuelType: {
      type: String,
      default: "Petrol",
    },
    seats: {
      type: Number,
      default: 5,
    },
    transmission: {
      type: String,
      default: "Manual",
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;