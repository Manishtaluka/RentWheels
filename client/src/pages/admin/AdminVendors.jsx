import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

function AdminVendors() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/signin");
      return;
    }
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load vendors");
        return;
      }
      setVendors(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/vendor/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to approve vendor");
        return;
      }
      toast.success("Vendor approved");
      setVendors(vendors.map((v) =>
        v._id === id ? { ...v, isApproved: true } : v
      ));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/admin/vendor/reject/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to reject vendor");
        return;
      }
      toast.success("Vendor rejected");
      setVendors(vendors.map((v) =>
        v._id === id ? { ...v, isApproved: false } : v
      ));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      const res = await fetch(`/api/admin/vendor/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to delete vendor");
        return;
      }
      toast.success("Vendor deleted");
      setVendors(vendors.filter((v) => v._id !== id));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Vendors</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Vendor</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {vendor.username}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{vendor.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {vendor.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      vendor.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {vendor.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {!vendor.isApproved && (
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className="text-green-500 hover:text-green-700 transition"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {vendor.isApproved && (
                      <button
                        onClick={() => handleReject(vendor._id)}
                        className="text-yellow-500 hover:text-yellow-700 transition"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(vendor._id)}
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

export default AdminVendors;