import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { FaCheck, FaTrash } from "react-icons/fa";

function AdminVehicles() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/signin");
      return;
    }
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/admin/vehicles", {
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

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/vehicle/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to approve vehicle");
        return;
      }
      toast.success("Vehicle approved");
      setVehicles(vehicles.map((v) =>
        v._id === id ? { ...v, isApproved: true } : v
      ));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      const res = await fetch(`/api/admin/vehicle/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to delete vehicle");
        return;
      }
      toast.success("Vehicle deleted");
      setVehicles(vehicles.filter((v) => v._id !== id));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Vehicles</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Vehicle</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Type</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Location</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Price/Day</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Vendor</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={vehicle.images?.[0] || "https://via.placeholder.com/50"}
                      alt="vehicle"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {vehicle.brand} {vehicle.model}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{vehicle.type}</td>
                  <td className="px-6 py-4 text-gray-500">{vehicle.location}</td>
                  <td className="px-6 py-4 text-gray-500">₹{vehicle.pricePerDay}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {vehicle.vendorDetails?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      vehicle.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {vehicle.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {!vehicle.isApproved && (
                      <button
                        onClick={() => handleApprove(vehicle._id)}
                        className="text-green-500 hover:text-green-700 transition"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminVehicles;