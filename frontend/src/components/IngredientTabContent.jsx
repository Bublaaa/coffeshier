import { useState } from "react";
import * as LucideIcons from "lucide-react";
import Input from "./Input";
import { formatDate } from "../utils/date";

const IngredientSkeleton = ({ count }) => {
  return;
};

const StockMovementSkeleton = ({ count }) => {
  return;
};

const IngredientTabContent = ({
  activeTab,
  ingredients,
  orders,
  isLoadingIngredients,
}) => {
  const [collapsedRows, setCollapsedRows] = useState({});

  const toggleCollapse = (id) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
  };

  if (isLoadingIngredients) {
    return <p>loading</p>;
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5 px-5">
        <div className="flex items-center gap-5">
          {/* Add Ingredient Button */}
          <button className="rounded-lg bg-accent p-3 text-white hover:bg-accent-hover">
            <LucideIcons.Plus />
          </button>
          <h1 className="text-dark font-bold text-3xl">
            {activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}
          </h1>
        </div>
        {/* Search Ingredient */}
        <Input
          icon={LucideIcons.Search}
          type="text"
          placeholder="Search by name"
          onChange={handleSearch}
        />
      </div>

      <div className="w-full overflow-x-auto">
        {/* Table Header */}
        <div className="flex flex-row bg-accent rounded-lg text-white font-semibold items-center">
          <div className="px-6 py-3">
            <input
              id="checkbox-all-search"
              type="checkbox"
              className="w-5 h-5 mt-1 focus:ring-accent"
            />
          </div>
          <div className="min-w-xs px-3 py-3">Ingredient Name</div>
          <div className="min-w-3xs px-3 py-3">Quantity</div>
          <div className="min-w-3xs px-3 py-3">Last Order</div>
          <div className="px-3 py-3 w-12"></div>
        </div>

        {/* Ingredient Rows */}
        <div>
          {ingredients.map((ingredient) => {
            const isCollapsed = collapsedRows[ingredient._id] || false;
            return (
              <>
                <div className="px-6">
                  <span> </span>
                </div>
                <div
                  key={ingredient._id}
                  className="flex flex-row  items-center my-1 bg-white rounded-lg cursor-pointer"
                  onClick={() => toggleCollapse(ingredient._id)}
                >
                  <div className="px-6 py-3">
                    <input
                      id={ingredient._id}
                      type="checkbox"
                      className="w-4 h-4 mt-1"
                    />
                  </div>
                  {/* Ingredient name */}
                  <div className="px-3 py-3 min-w-xs font-medium text-gray-900">
                    {ingredient.name.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}
                  </div>
                  {/* Available Quantity */}
                  <div className="min-w-3xs px-3 py-3">
                    {ingredient.stockQuantity} {ingredient.unit}
                  </div>
                  {/* Last Order */}
                  <div className="min-w-3xs px-3 py-3">
                    {formatDate(ingredient.updatedAt)}
                  </div>
                  <div className=" px-3 py-3  ml-auto">
                    <LucideIcons.ChevronRight
                      className={`transition-transform ${
                        isCollapsed ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
                {/* Stock Movement Rows */}
                {isCollapsed && (
                  <div className="flex flex-row text-gray-500 w-full bg-white py-3 -mt-3 rounded-lg ">
                    <div className="pl-18 pr-3 w-full ">
                      <p className="px-3 font-semibold">Orders</p>
                      <div>
                        {ingredient.stockMovements.map((stock, index) => {
                          const matchOrder = orders.find(
                            (order) => order._id === stock.orderId
                          );
                          const isLast =
                            index === ingredient.stockMovements.length - 1;
                          return (
                            <div
                              key={stock._id}
                              className="flex flex-row w-full hover:bg-gray-100 cursor-pointer rounded-lg pl-5"
                            >
                              {/* |_ Border */}
                              <div className="relative text-center py-2 px-3">
                                <span
                                  className={`absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-400 ${
                                    isLast ? "bottom-1/2" : "bottom-0"
                                  }`}
                                ></span>
                                <span className="absolute left-1/2 right-0 top-1/2 h-[1px] bg-gray-400"></span>
                              </div>

                              <div className="flex flex-row min-w-2xs pl-4 pr-4 py-1 gap-7">
                                {/* Order Id */}
                                <p>Order #{matchOrder?._id.slice(-5)}</p>
                                {/* Order Status */}
                                <p
                                  className={`text-lg font-semibold ${
                                    matchOrder?.status === "paid"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {matchOrder?.status.replace(
                                    /^(\w)/,
                                    (match) => match.toUpperCase()
                                  )}
                                </p>
                              </div>
                              <div
                                className={`flex flex-row items-center min-w-3xs gap-2 font-semibold py-2 px-3 ${
                                  stock.type === "IN"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                <p>{stock.quantity}</p>
                                <p>{ingredient.unit}</p>
                              </div>

                              <p className="min-w-3xs px-3 py-2">
                                {stock.source}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IngredientTabContent;
