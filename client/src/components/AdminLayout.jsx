import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import {
  FaHome,
  FaUsers,
  FaCar,
  FaStore,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
  { label: "Users", path: "/admin/users", icon: <FaUsers /> },
  { label: "Vendors", path: "/admin/vendors", icon: <FaStore /> },
  { label: "Vehicles", path: "/admin/vehicles", icon: <FaCar /> },
  { label: "Bookings", path: "/admin/bookings", icon: <FaClipboardList /> },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/signin");
    toast.success("Signed out successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-green-400">
            RentWheels Admin
          </h1>
        </div>

        {/* Nav Links */}
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

        {/* Sign Out */}
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

export default AdminLayout;