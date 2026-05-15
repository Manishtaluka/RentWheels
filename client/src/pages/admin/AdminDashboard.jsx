import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location
import {
  FaUsers,
  FaStore,
  FaCar,
  FaClipboardList,
  FaClock,
} from "react-icons/fa";

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/signin");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/dashboard"), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load stats");
        return;
      }
      setStats(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {currentUser?.username}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<FaUsers className="text-blue-600 text-xl" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Vendors"
          value={stats?.totalVendors || 0}
          icon={<FaStore className="text-purple-600 text-xl" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Total Vehicles"
          value={stats?.totalVehicles || 0}
          icon={<FaCar className="text-green-600 text-xl" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={<FaClipboardList className="text-orange-600 text-xl" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Pending Vendors"
          value={stats?.pendingVendors || 0}
          icon={<FaClock className="text-red-600 text-xl" />}
          color="bg-red-100"
        />
        <StatCard
          title="Pending Vehicles"
          value={stats?.pendingVehicles || 0}
          icon={<FaClock className="text-yellow-600 text-xl" />}
          color="bg-yellow-100"
        />
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;