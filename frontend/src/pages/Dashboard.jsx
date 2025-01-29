import { motion } from "framer-motion";
import { formatDate } from "../utils/date.js";
import { useAuthStore } from "../store/authStore";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import OrderCart from "../components/OrderCart.jsx";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="w-full flex flex-row gap-2 m-2 h-screen">
      {/* Sidebar with fixed width */}

      <Sidebar />

      {/* Main Content: Flexible width */}
      <div className="flex flex-col flex-grow gap-2 overflow-hidden">
        <Navbar />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* OrderCart with fixed width */}
      <div className="w-96">
        <OrderCart />
      </div>
    </div>
  );
};

export default Dashboard;
