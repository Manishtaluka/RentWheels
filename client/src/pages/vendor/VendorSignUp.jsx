import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  username: z.string().min(3, "Minimum 3 characters required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
});

function VendorSignUp() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }
      toast.success("Account created! Wait for admin approval.");
      navigate("/vendor/signin");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gray-900 px-6 py-5">
          <h1 className="text-2xl font-bold text-white">Vendor Sign Up</h1>
          <p className="text-gray-400 text-sm mt-1">
            Register your business on RentWheels
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-6"
        >
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Enter business name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Creating account..." : "Register as Vendor"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/vendor/signin" className="text-gray-900 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VendorSignUp;