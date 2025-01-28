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
    <div className="w-full flex flex-row gap-2 m-2">
      <Sidebar />
      <div className="w-full flex flex-col gap-2">
        <Navbar />
        <Outlet />
      </div>
      <OrderCart />
    </div>
  );
};

export default Dashboard;
