import CategoryCard from "../components/CategoryCard.jsx";
import MenuCard from "../components/MenuCard.jsx";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import OrderCart from "../components/OrderCart.jsx";
import { Blend, Blocks, CookingPot, Plus, ShoppingBag } from "lucide-react";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useProductStore } from "../store/productStore";

const ProductPage = () => {
  const [activeCategory, setActiveCategory] = useState("Menu");
  const [activeCategoryId, setActiveCategoryId] = useState("");
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

  useEffect(() => {
    fetchIngredients();
    fetchProducts();
  }, [fetchIngredients, fetchProducts]);

  if (isLoadingProducts) {
  }

  return (
    <div className="flex flex-row gap-5 my-5 mr-5">
      <div className="flex flex-col gap-5 w-4/6">
        {/* <Navbar /> */}
        {/* Category Card */}
        <div className="flex flex-row h-fit overflow-x-auto gap-5 scrollbar-hidden">
          <div
            onClick={() => setActiveCategory("Menu")}
            className={`${
              activeCategory === "Menu"
                ? "text-white bg-accent hover:bg-accent-hover"
                : "text-dark bg-white hover:bg-gray-200"
            } flex flex-col justify-between cursor-pointer py-4 px-5 rounded-lg`}
          >
            <Blocks className="size-7 mb-4" />
            <p
              className={`${
                activeCategory === "Menu"
                  ? "text-white font-bold"
                  : "text-dark font-bold"
              } whitespace-nowrap`}
            >
              Menu
            </p>
          </div>
          <div
            onClick={() => setActiveCategory("Merchandise")}
            className={`${
              activeCategory === "Merchandise"
                ? "text-white bg-accent hover:bg-accent-hover"
                : "text-dark bg-white hover:bg-gray-200"
            } flex flex-col justify-between cursor-pointer py-4 px-5 rounded-lg`}
          >
            <ShoppingBag className="size-7 mb-4" />
            <p
              className={`${
                activeCategory === "Merchandise"
                  ? "text-white font-bold"
                  : "text-dark font-bold"
              } whitespace-nowrap`}
            >
              Merchandise
            </p>
          </div>
          <div
            onClick={() => setActiveCategory("Ingredient")}
            className={`${
              activeCategory === "Ingredient"
                ? "text-white bg-accent hover:bg-accent-hover"
                : "text-dark bg-white hover:bg-gray-200"
            } flex flex-col justify-between cursor-pointer py-4 px-5 rounded-lg`}
          >
            <CookingPot className="size-7 mb-4" />
            <p
              className={`${
                activeCategory === "Ingredient"
                  ? "text-white font-bold"
                  : "text-dark font-bold"
              } whitespace-nowrap`}
            >
              Ingredient
            </p>
          </div>
        </div>
        {/* Menu Card */}
        <div className="flex flex-col flex-1 gap-5 min-h-0">
          <div className="flex flex-row gap-5 items-center">
            <button className="w-fit rounded-lg bg-accent p-3 text-white hover:bg-accent-hover">
              <Plus />
            </button>
            <h1 className="text-dark font-bold text-3xl">
              {activeCategory.replace(/\b\w/g, (char) => char.toUpperCase())}
            </h1>
          </div>

          <div className="h-[62vh] grid grid-cols-3 gap-5 overflow-y-auto scrollbar-hidden">
            {/* <MenuCard activeCategoryId={activeCategoryId} /> */}
          </div>
        </div>
      </div>
      <div className="w-2/6">{/* <OrderCart /> */}</div>
    </div>
  );
};
export default ProductPage;
