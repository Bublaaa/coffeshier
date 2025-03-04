import { useState, useEffect } from "react";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useProductStore } from "../store/productStore.js";
import { useOrderStore } from "../store/orderStore.js";
import { motion } from "framer-motion";
import Button from "../components/Button.jsx";

import * as LucideIcons from "lucide-react";
import IngredientTabContent from "../components/IngredientTabContent.jsx";
import ProductTabContent from "../components/ProductTabContent.jsx";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("Product");
  // const [activeCategoryId, setActiveCategoryId] = useState("");
  // Fetching state from ingredient store
  const {
    ingredients,
    fetchIngredients,
    addIngredient,
    isLoading: isLoadingIngredients, // Rename to avoid conflict
    error: ingredientError, // Rename
  } = useIngredientStore();

  // Fetching state from product store
  const {
    products,
    fetchProducts,
    fetchProductsByCategory,
    isLoading: isLoadingProducts, // Rename
    error: productError, // Rename
  } = useProductStore();

  const {
    orders,
    fetchOrders,
    isLoading: isLoadingOrders,
    error: orderError,
  } = useOrderStore();

  const merchandiseTabContent = ({ activeTab }) => {
    return (
      <div className="flex flex-row h-fit md:gap-5 gap-2 items-center">
        <Button className="mx-1 " buttonType="primary" buttonSize="icon">
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
    );
  };
  const tabs = [
    {
      id: "product",
      label: "Product",
      icon: "Blocks",
      content: (props) => (
        <ProductTabContent
          activeTab={activeTab}
          products={products}
          ingredients={ingredients}
          orders={orders}
          isLoadingProducts={isLoadingProducts}
        />
      ),
    },
    {
      id: "merchandise",
      label: "Merchandise",
      icon: "ShoppingBag",
      content: (props) => merchandiseTabContent(props),
    },
    {
      id: "ingredient",
      label: "Ingredient",
      icon: "CookingPot",
      content: (props) => (
        <IngredientTabContent
          activeTab={activeTab}
          ingredients={ingredients}
          orders={orders}
          isLoadingIngredients={isLoadingIngredients}
          isLoadingProducts={isLoadingProducts}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchIngredients();
    fetchProducts();
    fetchOrders();
  }, [fetchIngredients, fetchProducts, fetchOrders]);

  return (
    <div className="flex flex-row md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300">
      <div className="flex flex-col md:gap-5 gap-2 w-full">
        {/* Tabs */}
        <div className="flex flex-row h-fit overflow-x-auto md:gap-5 gap-2  scrollbar-hidden">
          {tabs.map((tab, index) => {
            const IconComponent =
              LucideIcons[tab.icon] || LucideIcons.GlassWater;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: index / 3 }}
                key={tab.id}
                onClick={() => setActiveTab(tab.label)}
                className={`${
                  activeTab === tab.label
                    ? "text-white bg-accent hover:bg-accent-hover"
                    : "text-dark bg-white hover:bg-gray-200"
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
      {/* <div className="w-2/6"><OrderCart /></div> */}
    </div>
  );
};
export default ProductPage;
