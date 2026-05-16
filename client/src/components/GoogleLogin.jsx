import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/slices/userSlice";
import { apiUrl } from "../utils/api.js";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

function GoogleLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const googleRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const googleUser = await googleRes.json();

        // Send to our backend
        const res = await fetch(apiUrl("/api/auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token, ...googleUser }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Google login failed");
          return;
        }

        const { accessToken, refreshToken, ...userData } = data;
        dispatch(signInSuccess({ user: userData, accessToken, refreshToken }));
        toast.success("Signed in with Google!");
        navigate("/");

      } catch (error) {
        toast.error("Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </button>
  );
}

export default GoogleLogin;