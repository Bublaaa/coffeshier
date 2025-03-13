import { useState, useEffect } from "react";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useProductStore } from "../store/productStore.js";
import { useOrderStore } from "../store/orderStore.js";
import { useCategoryStore } from "../store/categoryStore.js";
import { motion } from "framer-motion";
import Button from "../components/Button.jsx";

import * as LucideIcons from "lucide-react";
import IngredientTabContent from "../components/ProductPage/IngredientTabContent.jsx";
import ProductTabContent from "../components/ProductPage/ProductTabContent.jsx";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("Product");

  // Fetching state from ingredient store
  const {
    ingredients,
    fetchIngredients,
    isLoading: isLoadingIngredients,
    currentPage,
    totalPages,
  } = useIngredientStore();

  // Fetching state from product store
  const {
    products,
    fetchProducts,
    fetchProductsByCategory,
    isLoading: isLoadingProducts,
    error: productError,
  } = useProductStore();

  // Fetching state from order store
  const {
    orders,
    fetchOrders,
    isLoading: isLoadingOrders,
    error: orderError,
  } = useOrderStore();

  // Fetching state from category store
  const {
    categories,
    fetchCategories,
    isLoading: isLoadingCategory,
    error: categoryError,
  } = useCategoryStore();

  // Ingredient Tab Function
  const handleSearch = ({ searchQuery }) => {
    fetchIngredients(1, searchQuery);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) fetchIngredients(currentPage + 1, 5);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) fetchIngredients(currentPage - 1, 5);
  };

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
      content: () => (
        <ProductTabContent
          categories={categories}
          activeTab={activeTab}
          ingredients={ingredients}
          products={products}
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
      content: () => (
        <IngredientTabContent
          activeTab={activeTab}
          ingredients={ingredients}
          orders={orders}
          isLoadingIngredients={isLoadingIngredients}
          isLoadingProducts={isLoadingProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          handleSearch={handleSearch}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchIngredients(currentPage, "");
    fetchProducts();
    fetchOrders();
    fetchCategories();
  }, [currentPage, fetchProducts, fetchOrders]);

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
