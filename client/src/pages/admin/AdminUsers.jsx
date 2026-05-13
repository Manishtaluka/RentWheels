import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

function AdminUsers() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/signin");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load users");
        return;
      }
      setUsers(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to delete user");
        return;
      }
      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">User</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Phone</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Joined</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={user.profilePicture}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {user.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 transition"
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

export default AdminUsers;