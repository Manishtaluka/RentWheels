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

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"RentWheels" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};