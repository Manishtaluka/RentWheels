import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: "RentWheels <onboarding@resend.dev>",
  to: "manishtaluka413@gmail.com",
  subject: "Test Email",
  html: "<h1>RentWheels email working ✅</h1>",
});

if (error) {
  console.log("❌ Error:", error);
} else {
  console.log("✅ Email sent:", data);
}