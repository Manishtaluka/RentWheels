import { Link } from "react-router-dom";
import { FaCar, FaShieldAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Rent Your Perfect Ride
          </h1>
          <p className="text-green-100 text-lg mb-8">
            Choose from hundreds of vehicles. Easy booking, great prices.
          </p>
          <Link
            to="/vehicles"
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition text-lg shadow-lg"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose RentWheels?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <FaCar className="text-green-600 text-4xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Wide Selection
              </h3>
              <p className="text-gray-500 text-sm">
                Choose from sedans, SUVs, hatchbacks and more from verified vendors.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <FaShieldAlt className="text-green-600 text-4xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-500 text-sm">
                All vehicles are verified and insured for your peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="flex justify-center mb-4">
                <FaMapMarkerAlt className="text-green-600 text-4xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Multiple Locations
              </h3>
              <p className="text-gray-500 text-sm">
                Pick up and drop off at convenient locations across the city.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-gray-500 mb-8">
            Sign up now and get access to the best rental deals.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Create Account
            </Link>
            <Link
              to="/vehicles"
              className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition"
            >
              View Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="py-12 px-6 bg-green-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Own a Vehicle?</h2>
        <p className="text-green-100 mb-6">
          List your vehicle and start earning today.
        </p>
        <Link
          to="/vendor/signup"
          className="bg-white text-green-700 font-bold px-6 py-2.5 rounded-lg hover:bg-green-50 transition"
        >
          Become a Vendor
        </Link>
      </section>

    </div>
  );
}

export default Home;