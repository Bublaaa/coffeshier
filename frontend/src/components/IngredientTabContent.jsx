import { useState, Suspense, lazy } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "./Input";
import { formatDate } from "../utils/date";

// Lazy load the nested stock movement table
const StockMovement = lazy(() => import("./StockMovement.jsx"));

const Skeleton = ({ count }) => (
  <div className="animate-[pulse_0.8s_ease-in-out_infinite] flex gap-5 flex-col">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="w-full bg-gray-300 py-5 rounded-lg"></div>
    ))}
  </div>
);

const IngredientTabContent = ({
  activeTab,
  ingredients,
  orders,
  isLoadingIngredients,
  isLoadingProducts,
}) => {
  const [collapsedRows, setCollapsedRows] = useState({});

  const toggleCollapse = (id) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoadingIngredients || isLoadingProducts) {
    return <Skeleton count={ingredients.length || 5} />;
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-5">
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
              <div key={ingredient._id}>
                {/* Ingredient Row */}
                <div
                  className="flex flex-row items-center my-1 bg-white rounded-lg cursor-pointer"
                  onClick={() => toggleCollapse(ingredient._id)}
                >
                  <div className="px-6 py-3">
                    <input
                      id={ingredient._id}
                      type="checkbox"
                      className="w-4 h-4 mt-1"
                    />
                  </div>
                  <div className="px-3 py-3 min-w-xs font-medium text-gray-900">
                    {ingredient.name.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-3xs px-3 py-3">
                    {ingredient.stockQuantity} {ingredient.unit}
                  </div>
                  <div className="min-w-3xs px-3 py-3">
                    {formatDate(ingredient.updatedAt)}
                  </div>
                  <div className="px-3 py-3 ml-auto">
                    <LucideIcons.ChevronRight
                      className={`transition-transform ${
                        isCollapsed ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Nested Stock Movements Row */}
                {isCollapsed && (
                  <Suspense
                    fallback={
                      <p className="text-center py-2">
                        Loading stock movements...
                      </p>
                    }
                  >
                    <StockMovement ingredient={ingredient} orders={orders} />
                  </Suspense>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IngredientTabContent;
