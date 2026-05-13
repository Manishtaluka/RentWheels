import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/slices/userSlice";
import toast from "react-hot-toast";

function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      dispatch(signOut());
      navigate("/signin");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-green-600">
          Rent<span className="text-black">Wheels</span>
        </h1>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-green-600 font-medium transition"
        >
          Home
        </Link>
        <Link
          to="/vehicles"
          className="text-gray-600 hover:text-green-600 font-medium transition"
        >
          Vehicles
        </Link>

        {/* If not logged in */}
        {!currentUser && (
          <div className="flex gap-3">
            <Link
              to="/signin"
              className="border border-green-600 text-green-600 px-4 py-1.5 rounded-md hover:bg-green-50 transition font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition font-medium"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* If logged in */}
        {currentUser && (
          <div className="flex items-center gap-4">
            <Link
              to="/my-bookings"
              className="text-gray-600 hover:text-green-600 font-medium transition text-sm"
            >
              My Bookings
            </Link>
            <Link to="/profile">
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-green-500"
              />
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;