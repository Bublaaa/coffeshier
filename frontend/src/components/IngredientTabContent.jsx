import { useState } from "react";
import * as LucideIcons from "lucide-react";
import Input from "./Input";
import { formatDate } from "../utils/date";

const IngredientTabContent = ({ activeTab, ingredients, orders }) => {
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

  return (
    <div className="flex flex-col bg-white rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5 px-5">
        <div className="flex items-center gap-5">
          <button className="rounded-lg bg-accent p-3 text-white hover:bg-accent-hover">
            <LucideIcons.Plus />
          </button>
          <h1 className="text-dark font-bold text-3xl">
            {activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}
          </h1>
        </div>
        <Input
          icon={LucideIcons.Search}
          type="text"
          placeholder="Search by name"
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <td className="px-6 py-3 w-12">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded-sm focus:ring-accent"
                />
              </td>
              <th className="px-6 py-3">Ingredient Name</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Last Order</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>

          {/* Ingredient Rows */}
          <tbody>
            {ingredients.map((ingredient) => {
              const isCollapsed = collapsedRows[ingredient._id] || false;
              return (
                <>
                  {/* Parent Ingredient Row */}
                  <tr
                    key={ingredient._id}
                    className="border-b border-gray-200 cursor-pointer"
                    onClick={() => toggleCollapse(ingredient._id)}
                  >
                    <td className="px-6 py-3">
                      <input
                        id={ingredient._id}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded-sm focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {ingredient.name.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {ingredient.stockQuantity} {ingredient.unit}
                    </td>
                    <td className="px-6 py-3">
                      {formatDate(ingredient.updatedAt)}
                    </td>
                    <td className="px-6 py-3 ">
                      <LucideIcons.ChevronRight
                        className={`transition-transform ${
                          isCollapsed ? "rotate-90" : ""
                        }`}
                      />
                    </td>
                  </tr>
                  {/* Stock Movement Rows */}
                  {isCollapsed && (
                    <tr className="text-gray-500">
                      <td className="px-6 py-2"></td>
                      <td colSpan={3} className="px-6 py-2">
                        <p className="font-bold">Orders</p>
                        <table className="w-full mt-2">
                          <tbody>
                            {ingredient.stockMovements.map((stock) => {
                              const matchOrder = orders.find(
                                (order) => order._id === stock.orderId
                              );
                              return (
                                <tr key={stock._id} className="">
                                  {/* |_ Border */}
                                  <td className="relative text-center py-2 px-4">
                                    <span className="absolute top-0 bottom-1/2 left-1/2 w-[1px] bg-gray-400"></span>
                                    <span className="absolute left-1/2 right-0 top-1/2 h-[1px] bg-gray-400"></span>
                                  </td>
                                  {/* Order Id */}
                                  <td className="px-3 py-2">
                                    Order #{matchOrder?._id.slice(-5)}
                                  </td>
                                  <td className="px-6 py-2">
                                    <span
                                      className={`fit rounded-full py-1 px-3 ${
                                        matchOrder?.status === "paid"
                                          ? "bg-green-100 text-green-500"
                                          : "bg-red-100 text-red-500"
                                      }`}
                                    >
                                      {matchOrder?.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td
                                    className={`text-right font-semibold py-2 ${
                                      stock.type === "IN"
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {stock.quantity} {ingredient.unit}
                                  </td>
                                  <td className="px-6 py-2">{stock.source}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientTabContent;
