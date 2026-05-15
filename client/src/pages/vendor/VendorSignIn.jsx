import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location


const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

function VendorSignIn() {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/vendor/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.message || "Signin failed");
        return;
      }

      const { accessToken, refreshToken, ...vendorData } = data;
      dispatch(signInSuccess({
        user: vendorData,
        accessToken,
        refreshToken,
      }));

      toast.success("Welcome back!");
      navigate("/vendor/dashboard");

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
          <h1 className="text-2xl font-bold text-white">Vendor Sign In</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to your vendor account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 p-6"
        >
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-500">
            No account?{" "}
            <Link to="/vendor/signup" className="text-gray-900 font-medium hover:underline">
              Register as Vendor
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default VendorSignIn;