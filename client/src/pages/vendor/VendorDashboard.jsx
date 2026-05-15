import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/VendorLayout";
import toast from "react-hot-toast";
import { FaCar, FaClipboardList, FaCheckCircle, FaClock } from "react-icons/fa";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location

function VendorDashboard() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isVendor) {
      navigate("/vendor/signin");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, bRes] = await Promise.all([
        fetch(apiUrl("/api/vendor/vehicles"), {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(apiUrl("/api/vendor/bookings"), {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const vData = await vRes.json();
      const bData = await bRes.json();

      setVehicles(Array.isArray(vData) ? vData : []);
      setBookings(Array.isArray(bData) ? bData : []);

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const approvedVehicles = vehicles.filter((v) => v.isApproved).length;
  const pendingVehicles = vehicles.filter((v) => !v.isApproved).length;

  if (isLoading) {
    return (
      <VendorLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {currentUser?.username}</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FaCar className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Vehicles</p>
            <p className="text-2xl font-bold text-gray-800">{vehicles.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaCheckCircle className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Approved</p>
            <p className="text-2xl font-bold text-gray-800">{approvedVehicles}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <FaClock className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-gray-800">{pendingVehicles}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <FaClipboardList className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-400 text-sm">No bookings yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {booking.vehicleDetails?.brand} {booking.vehicleDetails?.model}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.userDetails?.username} •{" "}
                    {new Date(booking.startDate).toLocaleDateString()} →{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-sm">
                    ₹{booking.totalAmount}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}

export default VendorDashboard;