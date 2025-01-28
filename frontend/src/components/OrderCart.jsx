import React, { useState } from "react";
import SideBarLink from "./SideBarLink.jsx";
import { Home, Utensils } from "lucide-react";
import OrderType from "./OrderType.jsx";
import { useAuthStore } from "../store/authStore.js";

const Sidebar = () => {
  const { user } = useAuthStore();
  const [activeOrderType, setActiveOrderType] = useState("Dine In");

  return (
    <>
      <div
        id="cta-button-sidebar"
        className="relative top-0 left-0 w-96 h-full transition-transform -translate-x-full sm:translate-x-0 bg-white rounded-xl"
        aria-label="Sidebar"
      >
        <div className="h-full w-full rounded-xl p-4 overflow-y-auto bg-white space-y-5">
          <div className="w-full h-fit p-2 border-b border-gray-200">
            <h2 className="text-dark font-semibold text-md">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="flex flex-row justify-between items-center">
            <h2 className="font-semibold text-2xl text-dark">Cart</h2>
            <p className="text-gray-400 "> #OrderId</p>
          </div>

          <div className="flex flex-row w-full overflow-x-auto space-x-4 scrollbar-hide">
            <OrderType
              onClick={() => setActiveOrderType("Dine In")}
              label="Dine In"
              isActive={activeOrderType === "Dine In"}
            />
            <OrderType
              label="Delivery"
              isActive={activeOrderType === "Delivery"}
              onClick={() => setActiveOrderType("Delivery")}
            />
            <OrderType
              label="Take Away"
              isActive={activeOrderType === "Take Away"}
              onClick={() => setActiveOrderType("Take Away")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
