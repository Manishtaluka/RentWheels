import { Link } from "react-router-dom";
import { FaGasPump, FaUsers, FaCog, FaMapMarkerAlt } from "react-icons/fa";

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

      {/* Vehicle Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={vehicle.images?.[0] || "https://via.placeholder.com/400x200?text=No+Image"}
          alt={vehicle.brand}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Vehicle Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            {vehicle.type}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="text-green-500" />
          <span>{vehicle.location}</span>
        </div>

        {/* Specs */}
        <div className="flex justify-between text-gray-500 text-xs mb-4">
          <div className="flex items-center gap-1">
            <FaGasPump className="text-green-500" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUsers className="text-green-500" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCog className="text-green-500" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-green-600 font-bold text-xl">
              ₹{vehicle.pricePerDay}
            </span>
            <span className="text-gray-400 text-sm">/day</span>
          </div>
          <Link
            to={`/vehicles/${vehicle._id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;