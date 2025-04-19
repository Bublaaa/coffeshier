import { useEffect, useState } from "react";
import { useOrderStore } from "../store/orderStore";
import { useIngredientStore } from "../store/ingredientStore";
import { useProductStore } from "../store/productStore";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import Button from "../components/Button";
import SellOrderTabContent from "../components/OrderPage/SellOrderTabContent";
import BuyOrderTabContent from "../components/OrderPage/BuyOrderTabContent";

const OrderPage = ({}) => {
  const { fetchOrders, orders } = useOrderStore();
  const { fetchIngredients, ingredients } = useIngredientStore();
  const { fetchProducts, products } = useProductStore();
  const [activeTab, setActiveTab] = useState("Buy Order");
  const tabs = [
    {
      id: "sell",
      label: "Sell Order",
      icon: "Blocks",
      content: () => (
        <SellOrderTabContent
          activeTab={activeTab}
          orders={orders.filter(
            (order) =>
              Array.isArray(order.products) && order.products.length > 0
          )}
          products={products}
        />
      ),
    },
    {
      id: "Buy",
      label: "Buy Order",
      icon: "Blocks",
      content: () => (
        <BuyOrderTabContent
          activeTab={activeTab}
          orders={orders.filter(
            (order) =>
              Array.isArray(order.ingredients) && order.ingredients.length > 0
          )}
          ingredients={ingredients}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
    fetchIngredients();
    fetchProducts();
  }, []);
  return (
    <div className="md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <div className="flex flex-col md:gap-5 gap-2 w-full">
        {/* Tabs */}
        <div className="flex flex-row h-fit overflow-x-auto md:gap-5 gap-2 p-1 scrollbar-hidden">
          {tabs.map((tab, index) => {
            const IconComponent =
              LucideIcons[tab.icon] || LucideIcons.GlassWater;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: index / 3 }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2, ease: "easeInOut" },
                }}
                key={tab.id}
                onClick={() => setActiveTab(tab.label)}
                className={`${
                  activeTab === tab.label
                    ? "text-white bg-accent hover:bg-accent-hover"
                    : "text-dark bg-white hover:border-2 border-accent"
                } flex flex-col justify-between cursor-pointer md:py-4 py-2 md:px-5 px-4 rounded-lg group`}
              >
                <IconComponent className="md:size-7 size-5 md:mb-4 mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p
                  className={`${
                    activeTab === tab.label
                      ? "text-white font-bold"
                      : "text-dark font-bold"
                  } whitespace-nowrap`}
                >
                  {tab.label}
                </p>
              </motion.div>
            );
          })}
        </div>
        {/* Tab Contents */}
        <div className="flex flex-col flex-1 gap-5 min-h-0">
          <div className=" gap-5 overflow-y-auto scrollbar-hidden">
            {tabs
              .find((tab) => tab.label === activeTab)
              ?.content({ activeTab })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
