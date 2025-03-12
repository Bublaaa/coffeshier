import React from "react";
import { MoveUpRight, MoveDownRight } from "lucide-react";
import { motion } from "framer-motion";

const StockMovement = ({ ingredient, orders }) => {
  const hasMatchingOrder = ingredient.stockMovements.some((stock) =>
    orders.some((order) => order._id === stock.orderId)
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-row text-white w-full transition-all ease-in-out"
    >
      <div className="p-3 border border-t-gray-200 rounded-b-lg w-full">
        <p className="px-2 font-semibold">
          {hasMatchingOrder ? "Orders" : "No order yet"}
        </p>
        <div>
          {ingredient.stockMovements.map((stock, index) => {
            const matchOrder = orders.find(
              (order) => order._id === stock.orderId
            );
            const isLast = index === ingredient.stockMovements.length - 1;
            return (
              <div
                key={stock._id}
                className="flex flex-row w-full hover:bg-gray-100 cursor-pointer rounded-lg md:px-5 px-3 group"
              >
                {/* Vertical Border */}
                <div className="relative text-center py-2 px-3">
                  <span
                    className={`absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-400 ${
                      isLast ? "bottom-1/2" : "bottom-0"
                    }`}
                  ></span>
                  <span className="absolute left-1/2 right-0 top-1/2 h-[1px] bg-gray-400"></span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 items-center w-full py-1">
                  {/* Order Id */}
                  <p className="group-hover:font-semibold">
                    #{matchOrder?._id.slice(-5)}
                  </p>
                  {/* Stock Movement Type */}
                  <div
                    className={`flex flex-row items-center font-semibold ${
                      stock.type === "IN" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stock.type === "IN" ? (
                      <MoveUpRight className="w-fit text-green-300 size-5" />
                    ) : (
                      <MoveDownRight className="text-red-300 size-5" />
                    )}
                    <p>{stock.quantity}</p>
                    <p className="pl-1">{ingredient.unit}</p>
                  </div>
                  {/* Order Status */}
                  <div
                    className={`rounded-lg w-fit items-center justify-center ${
                      matchOrder?.status === "paid"
                        ? "bg-green-200 border border-green-300"
                        : "bg-red-200 border border-red-300"
                    }`}
                  >
                    <p
                      className={`px-2 py-1 ${
                        matchOrder?.status === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {matchOrder?.status.toUpperCase()}
                    </p>
                  </div>
                  {/* Source */}
                  <p className="hidden md:block px-3 py-2">{stock.source}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StockMovement;
