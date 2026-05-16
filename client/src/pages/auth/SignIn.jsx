import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location
import GoogleLogin from "../../components/GoogleLogin.jsx";




// Validation rules
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

function SignIn() {
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
    dispatch(signInStart());

    try {
      const res = await fetch(apiUrl("/api/auth/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        dispatch(signInFailure(data.message));
        toast.error(data.message || "Signin failed");
        return;
      }

      // Save user and tokens to redux
      const { accessToken, refreshToken, ...userData } = data;
      dispatch(signInSuccess({
        user: userData,
        accessToken,
        refreshToken,
      }));

      toast.success("Signed in successfully!");

      // Redirect based on role
      if (userData.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      setLoading(false);
      dispatch(signInFailure("Something went wrong"));
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-green-600 px-6 py-5">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-green-100 text-sm mt-1">
            Sign in to your account
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm text-gray-500">
            <p>
              No account?{" "}
              <Link to="/signup" className="text-green-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
            <Link
              to="/vendor/signin"
              className="text-green-600 font-medium hover:underline"
            >
              Vendor Sign In
            </Link>
          </div>
          {/* Google Login — inside the card */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex-1 h-px bg-gray-200"></span>
                <span className="text-xs text-gray-400">OR</span>
                <span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <GoogleLogin />
            </div>
             
        
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
        </form>
      </div>
      
    </div>
  );
}

export default SignIn;