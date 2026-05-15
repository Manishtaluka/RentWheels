import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import Home from "./pages/user/Home.jsx";
import Vehicles from "./pages/user/Vehicles.jsx";
import VehicleDetail from "./pages/user/VehicleDetail.jsx";
import MyBookings from "./pages/user/MyBookings.jsx";
import Profile from "./pages/user/Profile.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminVendors from "./pages/admin/AdminVendors.jsx";
import AdminVehicles from "./pages/admin/AdminVehicles.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import VendorSignUp from "./pages/vendor/VendorSignUp.jsx";
import VendorSignIn from "./pages/vendor/VendorSignIn.jsx";
import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import AddVehicle from "./pages/vendor/AddVehicle.jsx";
import VendorVehicles from "./pages/vendor/VendorVehicles.jsx";
import VendorBookings from "./pages/vendor/VendorBookings.jsx";
import VendorProfile from "./pages/vendor/VendorProfile.jsx"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/signup" element={<><Navbar /><SignUp /></>} />
        <Route path="/signin" element={<><Navbar /><SignIn /></>} />
        <Route path="/vehicles" element={<><Navbar /><Vehicles /></>} />
        <Route path="/vehicles/:id" element={<><Navbar /><VehicleDetail /></>} />
        <Route path="/my-bookings" element={<><Navbar /><MyBookings /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/vendors" element={<AdminVendors />} />
        <Route path="/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />

        {/* Vendor routes */}
        <Route path="/vendor/signup" element={<VendorSignUp />} />
        <Route path="/vendor/signin" element={<VendorSignIn />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/add-vehicle" element={<AddVehicle />} />
        <Route path="/vendor/vehicles" element={<VendorVehicles />} />
        <Route path="/vendor/bookings" element={<VendorBookings />} />
        <Route path="/vendor/profile" element={<VendorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;