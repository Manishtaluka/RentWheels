import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaGasPump,
  FaUsers,
  FaCog,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { apiUrl } from "../../utils/api.js";
import toast from "react-hot-toast";

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, accessToken } = useSelector((state) => state.user);

  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isProcessing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const res = await fetch(apiUrl(`/api/user/vehicles/${id}`));
      const data = await res.json();
      if (!res.ok) {
        toast.error("Vehicle not found");
        navigate("/vehicles");
        return;
      }
      setVehicle(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return { days: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { days: 0, total: 0 };
    return { days, total: days * vehicle.pricePerDay };
  };

  const { days, total } = calculateTotal();

  const handlePayment = async () => {
    if (!currentUser) {
      toast.error("Please sign in to book");
      navigate("/signin");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select pickup and dropoff dates");
      return;
    }
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    setProcessing(true);

    try {
      // Step 1 — Create Razorpay order from backend
      const res = await fetch(apiUrl("/api/payment/create-order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          startDate,
          endDate,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        toast.error(orderData.message || "Failed to create order");
        setProcessing(false);
        return;
      }

      // Step 2 — Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "RentWheels",
        description: `${vehicle.brand} ${vehicle.model} — ${days} day${days > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // Step 3 — Verify payment and create booking
          try {
            const verifyRes = await fetch(apiUrl("/api/payment/verify"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                vehicleId: vehicle._id,
                startDate,
                endDate,
                totalAmount: orderData.amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              toast.error(verifyData.message || "Payment verification failed");
              return;
            }

            toast.success("Booking confirmed! Check your email 📧");
            navigate("/my-bookings");

          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: currentUser.username,
          email: currentUser.email,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setProcessing(false);

    } catch (error) {
      toast.error("Something went wrong");
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Images & Info */}
          <div>
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden h-72 bg-gray-200 mb-3">
              <img
                src={
                  vehicle.images?.[selectedImage] ||
                  "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={vehicle.brand}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {vehicle.images?.length > 1 && (
              <div className="flex gap-2 mb-5">
                {vehicle.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`img-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-2xl font-bold text-gray-800">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {vehicle.type}
                </span>
              </div>

              <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                <FaMapMarkerAlt className="text-green-500" />
                <span>{vehicle.location}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                <div>
                  <FaGasPump className="text-green-500 text-xl mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Fuel</p>
                  <p className="text-sm font-medium">{vehicle.fuelType}</p>
                </div>
                <div>
                  <FaUsers className="text-green-500 text-xl mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="text-sm font-medium">{vehicle.seats}</p>
                </div>
                <div>
                  <FaCog className="text-green-500 text-xl mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Transmission</p>
                  <p className="text-sm font-medium">{vehicle.transmission}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Booking */}
          <div>
            {/* Price */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
              <p className="text-gray-500 text-sm mb-1">Price per day</p>
              <p className="text-4xl font-bold text-green-600">
                ₹{vehicle.pricePerDay}
                <span className="text-gray-400 text-lg font-normal">/day</span>
              </p>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Book This Vehicle
              </h2>

              {/* Start Date */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Pick Up Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-green-500" />
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Drop Off Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-green-500" />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {days > 0 && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>₹{vehicle.pricePerDay} x {days} day{days > 1 ? "s" : ""}</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-2">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{total}</span>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <FaShieldAlt />
                    Pay ₹{total > 0 ? total : "0"} Securely
                  </>
                )}
              </button>

              {/* Razorpay Badge */}
              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Secured by Razorpay
              </p>

              {!currentUser && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  You need to{" "}
                  <span
                    className="text-green-600 cursor-pointer font-medium"
                    onClick={() => navigate("/signin")}
                  >
                    sign in
                  </span>{" "}
                  to book
                </p>
              )}
            </div>

            {/* Vendor Info */}
            {vehicle.vendorId && (
              <div className="bg-white rounded-xl shadow-sm p-5 mt-5">
                <h3 className="font-bold text-gray-700 mb-2">Vendor Info</h3>
                <p className="text-sm text-gray-500">{vehicle.vendorId.username}</p>
                <p className="text-sm text-gray-500">{vehicle.vendorId.phoneNumber}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;