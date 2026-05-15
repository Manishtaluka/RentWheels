import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/VendorLayout";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

function VendorBookings() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!currentUser?.isVendor) {
      navigate("/vendor/signin");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/vendor/bookings", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load bookings");
        return;
      }
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings by status
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // Calculate total revenue
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <VendorLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-6">Track all bookings for your vehicles</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
          <p className="text-gray-500 text-xs mt-1">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
          <p className="text-gray-500 text-xs mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
          <p className="text-gray-500 text-xs mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
          <p className="text-gray-500 text-xs mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "cancelled", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === s
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-medium">No bookings found</p>
          <p className="text-sm mt-2">
            {filter === "all"
              ? "You have no bookings yet"
              : `No ${filter} bookings`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm p-5"
            >
              <div className="flex gap-4">

                {/* Vehicle Image */}
                <img
                  src={
                    booking.vehicleDetails?.images?.[0] ||
                    "https://via.placeholder.com/100"
                  }
                  alt="vehicle"
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                {/* Booking Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {booking.vehicleDetails?.brand}{" "}
                        {booking.vehicleDetails?.model}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Booked by:{" "}
                        <span className="font-medium text-gray-700">
                          {booking.userDetails?.username}
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {booking.userDetails?.email}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Dates and Amount */}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Pick Up</p>
                      <p className="font-medium text-gray-700">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Drop Off</p>
                      <p className="font-medium text-gray-700">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Total Amount</p>
                      <p className="font-bold text-green-600">
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-gray-400 text-xs">Payment</p>
                      <p className="font-medium text-gray-700 capitalize">
                        {booking.paymentStatus}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorBookings;