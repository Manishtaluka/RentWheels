import { useEffect, useState } from "react";
import VehicleCard from "../../components/VehicleCard";
import { apiUrl } from "../../utils/api.js";
import toast from "react-hot-toast";
import { FaSearch, FaFilter } from "react-icons/fa";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterFuel, setFilterFuel] = useState("All");
  const [filterTransmission, setFilterTransmission] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);

  const vehicleTypes = ["All", "Sedan", "SUV", "Hatchback", "Truck", "Van"];
  const fuelTypes = ["All", "Petrol", "Diesel", "Electric", "CNG"];
  const transmissionTypes = ["All", "Manual", "Automatic"];

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
  const locations = ["All", ...new Set(vehicles.map((v) => v.location))];

  // Filter vehicles
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesSearch =
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "All" || v.type === filterType;
      const matchesLocation =
        filterLocation === "All" || v.location === filterLocation;
      const matchesFuel = filterFuel === "All" || v.fuelType === filterFuel;
      const matchesTransmission =
        filterTransmission === "All" || v.transmission === filterTransmission;
      const matchesPrice = v.pricePerDay <= priceRange;
      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesFuel &&
        matchesTransmission &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleReset = () => {
    setSearch("");
    setFilterType("All");
    setFilterLocation("All");
    setFilterFuel("All");
    setFilterTransmission("All");
    setSortBy("default");
    setPriceRange(10000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Vehicles</h1>
            <p className="text-gray-500 mt-1">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
          >
            <FaFilter className="text-green-600" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by brand, model or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Vehicle Type */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Vehicle Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {vehicleTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Fuel Type
              </label>
              <select
                value={filterFuel}
                onChange={(e) => setFilterFuel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Transmission
              </label>
              <select
                value={filterTransmission}
                onChange={(e) => setFilterTransmission(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {transmissionTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Max Price: ₹{priceRange}/day
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹500</span>
                <span>₹10000</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                onClick={handleReset}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                Reset All Filters
              </button>
            </div>

          </div>
        )}

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
            <button
              onClick={handleReset}
              className="mt-4 text-green-600 font-medium text-sm hover:underline"
            >
              Reset filters
            </button>
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