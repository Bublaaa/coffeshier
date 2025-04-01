import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCategoryStore } from "../store/categoryStore.js";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useEffect, useReducer, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { placeholder } from "../assets/index.js";
import { RadioInput, DropdownInput } from "../components/Input";
import * as LucideIcons from "lucide-react";
import Button from "../components/Button";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { menus, fetchProductDetails } = useProductStore();
  const {
    ingredients,
    fetchIngredients,
    isLoading: isLoadingIngredients,
  } = useIngredientStore();
  const {
    categories,
    fetchCategories,
    isLoading: isLoadingCategory,
  } = useCategoryStore();
  let selectedQuantity = 0;
  let selectedUnit = "";
  let selectedAdditionalPrice = 0;
  const initialState = {
    menus: {
      name: "",
      basePrice: 0,
      categoryId: "",
      status: "Not Available",
      description: "",
      sizes: [{ size: "regular", additionalPrice: 0 }],
      image: null,
      ingredientsList: [
        {
          ingredientId: "",
          quantityBySize: [{ size: "regular", quantity: 0, unit: "" }],
        },
      ],
      recipe: "",
    },
    selectedSize: "regular",
    errors: {},
  };

  const menuReducer = (state, action) => {
    switch (action.type) {
      case "SET_MENUS":
        return { ...state, menus: { ...state.menus, ...action.payload } };
      case "SET_CATEGORY":
        return { ...state, categoryId: action.payload };
      case "SET_STATUS":
        return { ...state, status: action.payload };
      case "SET_SELECTED_SIZE":
        return { ...state, selectedSize: action.payload };

      case "SET_INGREDIENTS":
        return { ...state, ingredients: action.payload };
      case "SET_ERRORS":
        return { ...state, errors: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(menuReducer, initialState);
  useEffect(() => {
    fetchProductDetails(id);
    fetchIngredients();
    fetchCategories();
    if (menus) {
      dispatch({ type: "SET_MENUS", payload: menus });
    }
  }, [id, menus]);
  const handleSizeChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_SELECTED_SIZE", payload: value });
  };
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_CATEGORY", payload: value });
  };
  const handleChangeStatus = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_STATUS", payload: value });
  };

  return (
    <div className=" md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <div className="flex flex-col md:gap-5 gap-2 h-full">
        <div className="flex justify-between items-center p-1">
          <Button buttonSize="icon" buttonType="secondary">
            <NavLink to={"/owner/product"}>
              <LucideIcons.ChevronLeft size={25} />
            </NavLink>
          </Button>
        </div>
        <div className="absolute inset-x-100 inset-y-10 flex items-center justify-end w-1/2 z-5">
          <img
            src={state.menus.image || placeholder}
            alt={state.menus.name || "Placeholder"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="relative z-10 flex flex-row md:gap-5 gap-2 h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-1/3 p-5 rounded-lg gap-5 bg-white mt-auto"
          >
            <h1 className="line-clamp-2 max-w-sm whitespace-normal">
              {menus.name}
            </h1>
            <p>{menus.descriptions || "No description available "}</p>
            <div className="flex flex-row gap-2 items-center">
              <DropdownInput
                label="Status"
                name="status"
                value={state.menus.status}
                options={[
                  { value: "Available", label: "Available" },
                  { value: "Not Available", label: "Not Available" },
                ]}
                onChange={handleChangeStatus}
              />
              <DropdownInput
                label="Category"
                name="categoryId"
                value={state.menus.categoryId}
                options={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                onChange={handleCategoryChange}
              />
            </div>
            <p>{state.menus.recipe || "No recipe available "}</p>
          </motion.div>
          <div className="flex flex-col gap-2 p-2 w-1/3 justify-end items-end">
            <div className="flex flex-row w-full justify-between items-center text-dark">
              <h6>Base Price</h6>
              <p>
                {state.menus.basePrice
                  ? state.menus.basePrice.toLocaleString("id-ID")
                  : "0"}
              </p>
            </div>
            <div className="flex flex-row w-full justify-between items-center border-b border-gray-300 pb-3">
              <h6>Additional</h6>
              <p>
                {selectedAdditionalPrice >= 0
                  ? selectedAdditionalPrice.toLocaleString("id-ID")
                  : "0"}
              </p>
            </div>
          </div>
          <motion.div className="w-1/3 mt-auto h-fit p-5 bg-white rounded-lg ">
            <RadioInput
              options={
                menus?.sizes?.map((item) => ({
                  value: item.size,
                  label: item.size.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  ),
                })) || []
              }
              initialValue={state.selectedSize}
              name="selectedSize"
              label="Available Sizes"
              onChange={handleSizeChange}
            />
            {state.menus?.ingredients?.length > 0 ? (
              state.menus.ingredients.map((ingredient) => {
                const selectedIngredient = ingredients.find(
                  (ingredientInList) =>
                    ingredientInList._id === ingredient.ingredientId
                );
                ingredient.quantityBySize.map((size) => {
                  if (state.selectedSize == size.size) {
                    selectedQuantity = size.quantity;
                    selectedUnit = size.unit;
                    selectedAdditionalPrice = size.additionalPrice;
                  }
                });
                return selectedIngredient ? (
                  <div
                    className="grid grid-cols-3 border-b border-gray-100 py-2 items-center"
                    key={selectedIngredient._id || selectedIngredient.name}
                  >
                    <p>
                      {selectedIngredient.name.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      )}
                    </p>
                    <p className="text-center">
                      {selectedQuantity !== null
                        ? selectedQuantity
                        : "No quantity found"}
                    </p>
                    <p>
                      {selectedUnit !== null ? selectedUnit : "No Unit found"}
                    </p>
                  </div>
                ) : (
                  <p key={ingredient._id || ingredient.name}>
                    Ingredient not found
                  </p>
                );
              })
            ) : (
              <p>No ingredients available</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
