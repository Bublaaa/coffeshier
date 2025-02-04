import { motion } from "framer-motion";
import { formatDate } from "../utils/date.js";
import { useAuthStore } from "../store/authStore";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="w-full flex flex-row h-screen">
      <Sidebar />
      <div className="flex-grow overflow-auto w-5/6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
