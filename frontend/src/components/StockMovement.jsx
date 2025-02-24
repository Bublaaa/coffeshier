import React from "react";

const StockMovement = ({ ingredient, orders }) => {
  return (
    <div className="flex flex-row text-gray-500 w-full bg-white py-3 -mt-3 rounded-lg ">
      <div className="pl-18 pr-3 w-full">
        <p className="px-3 font-semibold">Orders</p>
        <div>
          {ingredient.stockMovements.map((stock, index) => {
            const matchOrder = orders.find(
              (order) => order._id === stock.orderId
            );
            const isLast = index === ingredient.stockMovements.length - 1;

            return (
              <div
                key={stock._id}
                className="flex flex-row w-full hover:bg-gray-100 cursor-pointer rounded-lg pl-5"
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

                {/* Order Details */}
                <div className="flex flex-row min-w-2xs pl-4 pr-4 py-1 gap-7">
                  <p>Order #{matchOrder?._id.slice(-5)}</p>
                  <p
                    className={`text-lg font-semibold ${
                      matchOrder?.status === "paid"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {matchOrder?.status.charAt(0).toUpperCase() +
                      matchOrder?.status.slice(1)}
                  </p>
                </div>

                {/* Stock Movement Type */}
                <div
                  className={`flex flex-row items-center min-w-3xs gap-2 font-semibold py-2 px-3 ${
                    stock.type === "IN" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <p>{stock.quantity}</p>
                  <p>{ingredient.unit}</p>
                </div>

                {/* Source */}
                <p className="min-w-3xs px-3 py-2">{stock.source}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockMovement;
