import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",  // ✅ Brevo SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"RentWheels" <${process.env.BREVO_EMAIL}>`,
    to,
    subject,
    html,
  });
};