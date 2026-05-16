import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location
import GoogleLogin from "../../components/GoogleLogin.jsx";

// Validation rules
const schema = z.object({
  username: z.string().min(3, "Minimum 3 characters required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

function SignUp() {
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
      const res = await fetch(apiUrl("/api/auth/signup"), {
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

      toast.success("Account created successfully!");
      navigate("/signin");

    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-green-600 px-6 py-5">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-green-100 text-sm mt-1">
            Join RentWheels today
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
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-green-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
           {/* Google Login */}
          <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-1 h-px bg-gray-200"></span>
                <span className="text-xs text-gray-400">OR</span>
                <span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <GoogleLogin />
          </div>
        </form>
      </div>
     
    </div>
  );
}

export default SignUp;