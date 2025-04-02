import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCategoryStore } from "../store/categoryStore.js";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useEffect, useReducer, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { placeholder } from "../assets/index.js";
import { RadioInput, DropdownInput, Input } from "../components/Input";
import * as LucideIcons from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal.jsx";
import toast from "react-hot-toast";

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
    selectedAdditionalPrice: 0,
    totalPrice: 0,
    errors: {},
    isModalOpen: false,
    modalBody: null,
    modalTitle: "",
    modalSize: "small",
  };

  const EditStatusForm = ({}) => {
    return (
      <form>
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
      </form>
    );
  };
  const EditCategoryForm = ({ categories }) => {
    return (
      <form>
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
      </form>
    );
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
      case "SET_SELECTED_UNIT":
        return { ...state, selectedSize: action.payload };
      case "SET_SELECTED_QUANTITY":
        return { ...state, selectedQuantity: action.payload };
      case "SET_SELECTED_ADDITIONAL_PRICE":
        return { ...state, selectedAdditionalPrice: action.payload };
      case "SET_TOTAL_PRICE":
        return { ...state, totalPrice: action.payload };

      case "SET_MODAL_OPEN":
        return { ...state, isModalOpen: action.payload };
      case "SET_MODAL_BODY":
        return { ...state, modalBody: action.payload };
      case "SET_MODAL_TITLE":
        return { ...state, modalTitle: action.payload };
      case "SET_MODAL_SIZE":
        return { ...state, modalSize: action.payload };

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

    let additionalPrice = 0;
    menus.sizes.forEach((menu) => {
      if (menu.size === value) {
        additionalPrice = menu.additionalPrice;
        dispatch({
          type: "SET_SELECTED_ADDITIONAL_PRICE",
          payload: additionalPrice,
        });
      }
    });
    const totalPrice = state.menus.basePrice + additionalPrice;
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_CATEGORY", payload: value });
  };
  const handleChangeStatus = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_STATUS", payload: value });
  };

  const handleOpenModal = (title, body, size) => {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
    dispatch({ type: "SET_MODAL_TITLE", payload: title });
    dispatch({ type: "SET_MODAL_BODY", payload: body });
    dispatch({ type: "SET_MODAL_SIZE", payload: size });
  };

  const handleMenuChange = (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;
    switch (target.dataset.id) {
      case "status":
        handleOpenModal("Change Menu Name", <EditStatusForm />);
        break;
      case "category":
        handleOpenModal(
          "Change Category Name",
          <EditCategoryForm categories={categories} />
        );
        break;

      default:
        toast.error("Unknown menu change request:" + target.dataset.id);
    }
  };

  return (
    <div className=" md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <Modal
        isOpen={state.isModalOpen}
        title={state.modalTitle}
        body={state.modalBody}
        onClose={() => dispatch({ type: "SET_MODAL_OPEN", payload: false })}
      />

      <div className="flex flex-col md:gap-5 gap-2 h-full">
        <div className="flex justify-between items-center p-1">
          <Button buttonSize="icon" buttonType="secondary">
            <NavLink to={"/owner/product"}>
              <LucideIcons.ChevronLeft size={25} />
            </NavLink>
          </Button>
        </div>
        <div className="absolute inset-x-100 inset-y-10 flex items-center justify-end w-1/2 z-5">
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            src={state.menus.image || placeholder}
            alt={state.menus.name || "Placeholder"}
            className="max-w-full max-h-full object-contain hover:scale-105 hover:rotate-5"
          />
        </div>
        <div className="relative z-10 flex flex-row md:gap-5 gap-2 h-fit mt-auto">
          <motion.div
            onClick={(e) => handleMenuChange(e)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-1/3 p-5 rounded-lg gap-5 bg-white mt-auto"
          >
            <div className="flex flex-row gap-2 md:gap-5 items-center">
              {/* Status Display */}
              <div
                data-id="status"
                className={`px-3 py-2 rounded-lg font-semibold hover:cursor-pointer hover:scale-105 ${
                  state.menus.status === "Not Available"
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-300"
                }`}
              >
                <p
                  className={`${
                    state.menus.status === "Not Available"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {state.menus.status}
                </p>
              </div>
              {/* Category Display */}
              {categories
                .filter((category) => category._id === state.menus.categoryId)
                .map((category) => {
                  const IconComponent = category.icon
                    ? LucideIcons[category.icon]
                    : LucideIcons.HandPlatter;
                  return (
                    <div
                      key={category._id}
                      data-id="category"
                      className="flex flex-row items-center gap-2 px-3 py-2 bg-accent rounded-lg hover:cursor-pointer hover:scale-105 hover:bg-accent-hover"
                    >
                      <IconComponent className="size-5 text-white" />
                      <p className="font-semibold text-white">
                        {category.name.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                      </p>
                    </div>
                  );
                })}
            </div>
            {/* Menu Name */}
            <h1 className="line-clamp-3 max-w-sm whitespace-normal hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg px-2">
              {menus.name}
            </h1>
            {/* Menu Description */}
            <p className="hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg p-2">
              {menus.descriptions || "No description available "}
            </p>
            {/* Menu Recipe */}
            <div className="gap-2 hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg p-2">
              <h6>Recipe</h6>
              <p>{state.menus.recipe || "No recipe available "}</p>
            </div>
          </motion.div>
          {/* Price */}
          <div className="flex flex-col gap-2 p-2 w-1/3 justify-end items-end">
            <div className="flex flex-row w-full justify-between items-center text-dark hover:cursor-pointer hover:scale-101 hover:bg-gray-200 rounded-lg hover:p-2">
              <h6>Base Price</h6>
              <p>
                {state.menus.basePrice
                  ? state.menus.basePrice.toLocaleString("id-ID")
                  : "0"}
              </p>
            </div>
            {state.selectedAdditionalPrice > 0 && (
              <div className="flex flex-row w-full justify-between items-center">
                <h6>Size Price</h6>
                <p>{state.selectedAdditionalPrice.toLocaleString("id-ID")}</p>
              </div>
            )}
            <div className="flex flex-row w-full justify-between items-center border-t border-gray-300">
              <h5>Total Price</h5>
              <h6>{state.totalPrice.toLocaleString("id-ID")}</h6>
            </div>
          </div>
          <motion.div className="w-1/3 flex flex-col gap-2 mt-auto h-fit p-5 bg-white rounded-lg ">
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
                  }
                });
                return selectedIngredient ? (
                  <div
                    className="flex flex-col gap-1"
                    key={selectedIngredient._id}
                  >
                    <div
                      className="flex flex-row hover:cursor-pointer hover:scale-101 hover:bg-gray-200 rounded-lg p-2"
                      key={selectedIngredient._id || selectedIngredient.name}
                    >
                      <p>
                        {selectedIngredient.name.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                      </p>
                      <p className="text-center ml-auto">
                        {selectedQuantity !== null
                          ? selectedQuantity
                          : "No quantity found"}
                      </p>
                      <p>
                        {selectedUnit !== null ? selectedUnit : "No Unit found"}
                      </p>
                    </div>
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
