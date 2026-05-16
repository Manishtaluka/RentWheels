import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/api.js";
import toast from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp+password
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to reset password");
        return;
      }
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-green-600 px-6 py-5">
          <h1 className="text-2xl font-bold text-white">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-green-100 text-sm mt-1">
            {step === 1
              ? "Enter your email to receive an OTP"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        <div className="p-6">

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>1</div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
            }`}>2</div>
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link to="/signin" className="text-green-600 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          )}

          {/* Step 2 — OTP + New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  OTP (sent to {email})
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 tracking-widest text-center text-lg font-bold"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Back to email
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;