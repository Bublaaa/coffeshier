import * as LucideIcons from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";
import { formatDate, formatTime } from "../../utils/date";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

const SellOrderTabContent = ({ activeTab, orders, products }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button className="mx-1 " buttonType="primary" buttonSize="icon">
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <div className="flex flex-col md:gap-3 gap-2">
        {orders.map((order, index) => {
          const statusClass = clsx(
            "px-3 py-1 rounded-lg w-fit items-center",
            order.status === "paid" && "bg-green-200 text-green-400",
            order.status === "pending" && "bg-yellow-200 text-yellow-400",
            order.status === "canceled" && "bg-red-200 text-red-400",
            order.status === "shipped" && "bg-blue-200 text-blue-400"
          );
          return (
            <NavLink key={order._id} to={`/owner/orders/${order._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.1 * (index + 1) }}
                className="flex flex-col w-full md:p-3 p-2 md:gap-3 gap-2 bg-white rounded-lg hover:border-2 border-accent hover:bg-gray-100 hover:cursor-pointer"
              >
                <div className="w-full grid grid-cols-5 items-center select-none">
                  <p>
                    <span className="font-semibold">Order Id #</span>
                    {order._id.slice(-5)}
                  </p>
                  <div className={statusClass}>
                    {order.status.toUpperCase()}
                  </div>
                  <div className="flex flex-row gap-2">
                    <p>{formatDate(order.createdAt)}</p>
                    <p>{formatTime(order.createdAt)}</p>
                  </div>
                  <h6 className="text-end">
                    IDR. {order.totalAmount.toLocaleString("id-ID")}
                  </h6>
                  <LucideIcons.ChevronRight className="ml-auto transition-transform duration-300" />
                </div>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default SellOrderTabContent;
