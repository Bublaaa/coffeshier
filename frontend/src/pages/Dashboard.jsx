import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date.js";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

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
        <div className="w-full h-full rounded-xl bg-green-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
