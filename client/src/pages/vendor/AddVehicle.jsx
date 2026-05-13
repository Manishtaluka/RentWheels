import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VendorLayout from "../../components/VendorLayout";
import toast from "react-hot-toast";

function AddVehicle() {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    type: "Sedan",
    pricePerDay: "",
    location: "",
    fuelType: "Petrol",
    seats: "5",
    transmission: "Manual",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      images.forEach((img) => form.append("images", img));

      const res = await fetch("/api/vendor/add-vehicle", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to add vehicle");
        return;
      }

      toast.success("Vehicle added! Waiting for admin approval.");
      navigate("/vendor/vehicles");

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Vehicle</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Brand */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Toyota"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Model */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. Fortuner"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {["Sedan", "SUV", "Hatchback", "Truck", "Van"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Price Per Day (₹)</label>
            <input
              name="pricePerDay"
              type="number"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="e.g. 2000"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {["Petrol", "Diesel", "Electric", "CNG"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Seats */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Seats</label>
            <select
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {["2", "4", "5", "6", "7", "8"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {["Manual", "Automatic"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Images */}
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Vehicle Images (max 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isLoading ? "Adding vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </VendorLayout>
  );
}

export default AddVehicle;