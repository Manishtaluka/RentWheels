import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

function MyBookings() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/bookings", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load bookings");
        return;
      }
      setBookings(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-500 mb-8">View all your vehicle bookings</p>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium">No bookings yet</p>
            <p
              className="text-sm mt-2 text-green-600 cursor-pointer"
              onClick={() => navigate("/vehicles")}
            >
              Browse vehicles to book one
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm p-5 flex gap-4"
              >
                {/* Vehicle Image */}
                <img
                  src={
                    booking.vehicleDetails?.images?.[0] ||
                    "https://via.placeholder.com/100?text=Car"
                  }
                  alt="vehicle"
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">
                      {booking.vehicleDetails?.brand}{" "}
                      {booking.vehicleDetails?.model}
                    </h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    <p>
                      📅 {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="mt-1 font-medium text-green-600">
                      Total: ₹{booking.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;