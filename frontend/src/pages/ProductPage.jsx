import { useState, useEffect } from "react";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useProductStore } from "../store/productStore.js";
import { useOrderStore } from "../store/orderStore.js";

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
      <div className="flex flex-row h-fit gap-5 items-center">
        <button className="w-fit rounded-lg bg-accent p-3 text-white hover:bg-accent-hover">
          <LucideIcons.Plus />
        </button>
        <h1 className="text-dark font-bold text-3xl">
          {activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}
        </h1>
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
    <div className="flex flex-row gap-5 my-5 mr-5">
      <div className="flex flex-col gap-5 w-full">
        {/* Tabs */}
        <div className="flex flex-row h-fit overflow-x-auto gap-5 scrollbar-hidden">
          {tabs.map((tab) => {
            const IconComponent =
              LucideIcons[tab.icon] || LucideIcons.GlassWater;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.label)}
                className={`${
                  activeTab === tab.label
                    ? "text-white bg-accent hover:bg-accent-hover"
                    : "text-dark bg-white hover:bg-gray-200"
                } flex flex-col justify-between cursor-pointer py-4 px-5 rounded-lg`}
              >
                <IconComponent className="size-7 mb-4" />
                <p
                  className={`${
                    activeTab === tab.label
                      ? "text-white font-bold"
                      : "text-dark font-bold"
                  } whitespace-nowrap`}
                >
                  {tab.label}
                </p>
              </div>
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
