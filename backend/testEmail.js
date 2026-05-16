import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.sendMail({
  from: `"RentWheels" <${process.env.EMAIL}>`,
  to: process.env.EMAIL, // sends to yourself
  subject: "Test Email",
  html: "<h1>Test email working ✅</h1>",
}, (err, info) => {
  if (err) {
    console.log("❌ Error:", err.message);
  } else {
    console.log("✅ Email sent:", info.response);
  }
  process.exit();
});