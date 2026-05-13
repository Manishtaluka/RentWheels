import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import {
  FaHome,
  FaCar,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", path: "/vendor/dashboard", icon: <FaHome /> },
  { label: "My Vehicles", path: "/vendor/vehicles", icon: <FaCar /> },
  { label: "Add Vehicle", path: "/vendor/add-vehicle", icon: <FaPlus /> },
  { label: "Bookings", path: "/vendor/bookings", icon: <FaClipboardList /> },
  { label: "Profile", path: "/vendor/profile", icon: <FaUser /> },
];

function VendorLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/vendor/signin");
    toast.success("Signed out successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">
            RentWheels <span className="text-green-400">Vendor</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white w-full transition"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>

    </div>
  );
}

export default VendorLayout;