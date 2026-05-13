import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg",
    },
    isVendor: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // admin must approve vendor
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;