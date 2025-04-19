import * as LucideIcons from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatDate, formatTime } from "../../utils/date";
import clsx from "clsx";

const SellOrderTabContent = ({ activeTab, orders, products }) => {
  const [collapsedRows, setCollapsedRows] = useState({});
  const toggleCollapse = (id) => {
    setCollapsedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button className="mx-1 " buttonType="primary" buttonSize="icon">
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <div className="flex flex-col md:gap-5 gap-2">
        {orders.map((order) => {
          const isCollapsed = collapsedRows[order._id] || false;
          const boxClass = clsx(
            "px-3 py-1 rounded-lg w-fit items-center mx-auto", // base classes
            order.status === "paid" && "bg-green-200 text-green-400",
            order.status === "pending" && "bg-yellow-200 text-yellow-400",
            order.status === "canceled" && "bg-red-200 text-red-400",
            order.status === "shipped" && "bg-blue-200 text-blue-400"
          );
          return (
            <div
              key={order._id}
              className="flex flex-col w-full md:p-3 p-2 md:gap-3 gap-2 bg-white rounded-lg hover:border-2 border-accent hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => toggleCollapse(order._id)}
            >
              <div className="w-full grid grid-cols-5 items-center select-none">
                <p>
                  <span className="font-semibold">Order Id #</span>
                  {order._id.slice(-5)}
                </p>
                <div className={boxClass}>{order.status.toUpperCase()}</div>
                <div className="flex flex-row gap-2">
                  <p>{formatDate(order.createdAt)}</p>
                  <p>{formatTime(order.createdAt)}</p>
                </div>
                <h6 className="text-end">
                  IDR. {order.totalAmount.toLocaleString("id-ID")}
                </h6>
                <LucideIcons.ChevronRight
                  className={`ml-auto transition-transform duration-300 ${
                    isCollapsed ? "rotate-90" : ""
                  }`}
                />
              </div>
              {order.products.map((product, index) => {
                const selectedProduct = products.find(
                  (productInList) => productInList._id === product.productId
                );
                if (isCollapsed) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      key={product.productId}
                      className={`${
                        index === 0 ? "border-t border-gray-200 pt-2" : "pb-2"
                      } flex flex-col`}
                    >
                      <div className="grid grid-cols-5">
                        <div className="flex flex-row gap-2 items-center">
                          <p>{selectedProduct?.name || "No Available Name"}</p>
                          <p>-</p>
                          <p>
                            {product.customization.size.replace(
                              /\b\w/g,
                              (char) => char.toUpperCase()
                            )}
                          </p>
                        </div>
                        <div></div>
                        <div className="flex flex-row gap-2 items-center">
                          <p>{product.quantity}</p>
                          <p>x</p>
                          <p>{product.subtotal.toLocaleString("id-ID")}</p>
                        </div>
                      </div>

                      {product.customization.note && (
                        <div
                          className={`${
                            index + 1 === order.products.length
                              ? "mt-2 pt-2 border-t border-gray-200"
                              : ""
                          }`}
                        >
                          <p>Note:{product.customization.note}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellOrderTabContent;
