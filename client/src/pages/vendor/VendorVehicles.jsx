import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/VendorLayout";
import toast from "react-hot-toast";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function VendorVehicles() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isVendor) {
      navigate("/vendor/signin");
      return;
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vendor/vehicles", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load vehicles");
        return;
      }
      setVehicles(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      const res = await fetch(`/api/vendor/vehicle/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to delete");
        return;
      }
      toast.success("Vehicle deleted");
      setVehicles(vehicles.filter((v) => v._id !== id));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <VendorLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
        <Link
          to="/vendor/add-vehicle"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          <FaPlus /> Add Vehicle
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-medium">No vehicles yet</p>
          <Link
            to="/vendor/add-vehicle"
            className="text-green-600 text-sm mt-2 inline-block"
          >
            Add your first vehicle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={vehicle.images?.[0] || "https://via.placeholder.com/400x200"}
                  alt={vehicle.brand}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    vehicle.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {vehicle.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-green-600 font-bold">₹{vehicle.pricePerDay}/day</p>
                <p className="text-gray-500 text-sm">{vehicle.location}</p>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="mt-3 flex items-center gap-2 text-red-500 hover:text-red-700 text-sm transition"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorVehicles;