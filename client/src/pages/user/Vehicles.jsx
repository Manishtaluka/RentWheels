import { useEffect, useState } from "react";
import VehicleCard from "../../components/VehicleCard";
import toast from "react-hot-toast";
import { apiUrl } from "../../utils/api.js"; // adjust path based on file location

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");

  const vehicleTypes = ["All", "Sedan", "SUV", "Hatchback", "Truck", "Van"];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(apiUrl("/api/user/vehicles"));
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

  // Get unique locations
  const locations = [
    "All",
    ...new Set(vehicles.map((v) => v.location)),
  ];

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || v.type === filterType;
    const matchesLocation =
      filterLocation === "All" || v.location === filterLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Available Vehicles
        </h1>
        <p className="text-gray-500 mb-8">
          Find the perfect vehicle for your journey
        </p>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by brand or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No results */}
        {!isLoading && filteredVehicles.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium">No vehicles found</p>
            <p className="text-sm mt-2">Try changing your filters</p>
          </div>
        )}

        {/* Vehicle Grid */}
        {!isLoading && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Vehicles;