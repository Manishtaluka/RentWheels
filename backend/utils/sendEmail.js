import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  const { error } = await resend.emails.send({
    from: "RentWheels <onboarding@resend.dev>", // ✅ use this until you verify a domain
    to,
    subject,
    html,
  });

  if (error) {
    console.log("Email error:", error);
    throw new Error(error.message);
  }
};