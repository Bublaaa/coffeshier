import React, { useState } from "react";
import SideBarLink from "./SideBarLink.jsx";
import { Home, Trash, Utensils } from "lucide-react";
import OrderType from "./OrderType.jsx";
import OrderDetail from "./OrderDetail.jsx";
import { useAuthStore } from "../store/authStore.js";

const OrderCart = () => {
  const { user } = useAuthStore();
  const [activeOrderType, setActiveOrderType] = useState("Dine In");

  return (
    <>
      <div
        id="cta-button-sidebar"
        className="relative top-0 right-0 h-[calc(100vh-40px)] transition-transform -translate-x-full sm:translate-x-0 bg-white rounded-xl flex flex-col"
      >
        <div className="w-full p-4 space-y-5">
          <div className="flex flex-row w-full justify-between items-center border-b border-gray-200">
            {/* User Info */}
            <div className="w-full h-fit p-2">
              <h2 className="text-dark font-semibold text-md">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <button className="p-2 cursor-pointer text-dark hover:text-dark-hover hover:bg-gray-100 rounded-lg">
              <Trash />
            </button>
          </div>

          {/* Cart */}
          <div className="flex flex-row justify-between items-center h-fit">
            <h2 className="font-semibold text-2xl text-dark">Cart</h2>
            <p className="text-gray-400"> #OrderId</p>
          </div>

          {/* Order Types */}
          <div className="flex h-fit flex-row w-full overflow-x-auto space-x-4 scrollbar-hide">
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

        {/* Order Detail (fills remaining space) */}
        <div className="flex-1 overflow-y-auto space-y-5 scrollbar-hidden mx-4">
          <OrderDetail />
          <OrderDetail />
          <OrderDetail />
          <OrderDetail />
          <OrderDetail />
          <OrderDetail />
        </div>

        {/* Order Summary & Button (placed at the bottom) */}
        <div className=" space-y-2 p-4 mt-auto">
          <div className="w-full flex justify-between items-center">
            <p className="text-md text-gray-500">Items</p>
            <p className="text-md font-bold text-dark">Price</p>
          </div>
          <hr />
          <div className="w-full flex justify-between items-center">
            <p className="text-md text-gray-500">Total</p>
            <p className="text-md font-bold text-accent">Price</p>
          </div>
          <button className="w-full rounded-full text-white font-bold text-lg cursor-pointer bg-accent py-3 px-6">
            Place an Order
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderCart;
