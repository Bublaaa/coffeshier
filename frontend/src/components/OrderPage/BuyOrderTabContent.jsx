import * as LucideIcons from "lucide-react";
import Button from "../Button";
import { motion } from "framer-motion";
import { useState } from "react";

const BuyOrderTabContent = ({ activeTab, orders, ingredients }) => {
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
          return (
            <div
              key={order._id}
              className="flex flex-col w-full md:p-3 p-2  bg-white rounded-lg hover:border-2 border-accent hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => toggleCollapse(order._id)}
            >
              <div className="flex flex-row justify-between items-center">
                <p>{order._id}</p>
                <LucideIcons.ChevronRight
                  className={`ml-auto transition-transform duration-300 ${
                    isCollapsed ? "rotate-90" : ""
                  }`}
                />
              </div>
              {order.ingredients.map((ingredient) => {
                const selectedIngredient = ingredients.find(
                  (ingredientList) =>
                    ingredientList._id === ingredient.ingredientId
                );
                if (isCollapsed) {
                  return (
                    <div
                      key={ingredient.ingredientId}
                      className="grid grid-cols-3 md:pt-5 pt-2"
                    >
                      <p>{selectedIngredient?.name || "No Available Name"}</p>
                      <p>{ingredient.quantity}</p>
                      <p>{ingredient.unit}</p>
                      <p>{ingredient.subtotal}</p>
                    </div>
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

export default BuyOrderTabContent;
