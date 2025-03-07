import { useState, Suspense, lazy } from "react";
import * as LucideIcons from "lucide-react";
import Button from "./Button.jsx";
import { Input } from "./Input";
import { formatDate } from "../utils/date";
import { motion } from "framer-motion";

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
      <div className="flex justify-between items-center pb-2 md:pb-5">
        <div className="flex items-center md:gap-5 gap-2">
          {/* Add Ingredient Button */}
          <Button className="mx-1 " buttonType="primary" buttonSize="icon">
            <LucideIcons.Plus />
          </Button>
          <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
        </div>
        {/* Search Ingredient */}
        <Input
          className="w-fit"
          icon={LucideIcons.Search}
          type="text"
          placeholder="Search by name"
        />
      </div>

      <div className="w-full overflow-x-auto overflow-y-auto scrollbar-hidden">
        {/* Table Header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{ duration: 0.5 }}
          className="transition-all ease-in-out grid md:grid-cols-4 grid-cols-3 w-full bg-accent items-center font-semibold p-4 rounded-lg justify-between "
        >
          <div className="w-full">
            <p className="text-white">Ingredient Name</p>
          </div>
          <div className="">
            <p className="text-white">Quantity</p>
          </div>
          <div className="hidden md:block">
            <p className="text-white">Last Order</p>
          </div>
        </motion.div>
        {/* Ingredient Rows */}
        <div className="w-full space-y-2 mt-2">
          {ingredients.map((ingredient, index) => {
            const isCollapsed = collapsedRows[ingredient._id] || false;
            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: index / 4 }}
                key={ingredient._id}
                className="bg-white rounded-lg "
              >
                {/* Ingredient Row */}
                <div
                  className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full px-4 py-3 hover:bg-gray-100 transition cursor-pointer items-center"
                  onClick={() => toggleCollapse(ingredient._id)}
                >
                  <p className="truncate">
                    {ingredient.name.replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )}
                  </p>
                  <p className="text-gray-600  font-semibold">
                    {ingredient.stockQuantity} {ingredient.unit}
                  </p>
                  <p className="text-gray-500 hidden md:block">
                    {formatDate(ingredient.updatedAt)}
                  </p>
                  <LucideIcons.ChevronRight
                    className={`ml-auto transition-transform duration-300 ${
                      isCollapsed ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {/* Stock Movements Row */}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IngredientTabContent;
