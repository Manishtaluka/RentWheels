import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserSuccess, signOut } from "../../redux/slices/userSlice";
import VendorLayout from "../../components/VendorLayout";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location

function VendorProfile() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [isPasswordLoading, setPasswordLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Update profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/vendor/update"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update profile picture
  const handleUpdatePicture = async () => {
    if (!imageFile) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);

      const res = await fetch(apiUrl("/api/vendor/update-picture"), {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update picture");
        return;
      }
      dispatch(updateUserSuccess(data));
      setImageFile(null);
      setImagePreview(null);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(apiUrl("/api/vendor/update-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update password");
        return;
      }
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your vendor account? This cannot be undone.")) return;
    try {
      const res = await fetch(apiUrl("/api/vendor/delete"), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        toast.error("Failed to delete account");
        return;
      }
      dispatch(signOut());
      toast.success("Account deleted");
      navigate("/vendor/signup");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <VendorLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
      <p className="text-gray-500 mb-8">Manage your vendor account</p>

      {/* Profile Picture */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <img
            src={imagePreview || currentUser?.profilePicture}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-green-500"
          />
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imageFile && (
              <button
                onClick={handleUpdatePicture}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:bg-gray-400 w-fit"
              >
                {isLoading ? "Uploading..." : "Upload Picture"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Business Information</h2>
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Business Name
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Approval Status */}
          <div className="flex items-end">
            <div className="w-full bg-gray-50 rounded-lg px-4 py-2.5">
              <p className="text-xs text-gray-400 mb-1">Account Status</p>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                currentUser?.isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {currentUser?.isApproved ? "✅ Approved" : "⏳ Pending Approval"}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Current Password
            </label>
            <input
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPasswordLoading}
            className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:bg-gray-400 w-fit"
          >
            {isPasswordLoading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-gray-500 text-sm mb-4">
          Deleting your account will remove all your vehicles and data permanently.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Delete Vendor Account
        </button>
      </div>

    </VendorLayout>
  );
}

export default VendorProfile;