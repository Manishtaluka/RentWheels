import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.sendMail({
  from: `"RentWheels" <${process.env.BREVO_EMAIL}>`,
  to: "manishtaluka413@gmail.com",
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