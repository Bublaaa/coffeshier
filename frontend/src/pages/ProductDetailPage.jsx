import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCategoryStore } from "../store/categoryStore.js";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useEffect, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { placeholder } from "../assets/index.js";
import {
  EditStatusForm,
  EditCategoryForm,
  EditNameForm,
  EditDescriptionForm,
  EditRecipeForm,
  EditBasePriceForm,
  EditAvailableSizeForm,
  EditIngredientForm,
  DeleteConfirmationForm,
  EditImageForm,
} from "../components/Forms/ProductDetailForm.jsx";
import { RadioInput } from "../components/Input";
import * as LucideIcons from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal.jsx";

const ProductDetailPage = () => {
  const { id } = useParams();
  const {
    menus,
    isLoading: isLoadingProduct,
    fetchProductDetails,
    updateMenu,
    deleteProduct,
  } = useProductStore();
  const hasOpenedModalRef = useRef(false);
  const navigate = useNavigate();
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
  const initialState = {
    menus: {
      name: "",
      basePrice: 0,
      categoryId: "",
      status: "Not Available",
      description: "",
      sizes: [{ size: "regular", additionalPrice: 0 }],
      image: null,
      ingredients: [
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
    modalSize: "medium",
    isUpdated: false,
  };
  const menuReducer = (state, action) => {
    switch (action.type) {
      case "SET_MENUS":
        return {
          ...state,
          menus: {
            ...state.menus,
            ...action.payload,
          },
          isUpdated: true,
        };
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

      case "SET_IS_UPDATED":
        return { ...state, isUpdated: action.payload };

      case "SET_ERRORS":
        return { ...state, errors: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(menuReducer, initialState);

  // Initial data load form database
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchProductDetails(id),
          fetchIngredients(),
          fetchCategories(),
        ]);
      } catch (error) {
        console.error("Data fetching failed:", error);
      }
    };

    fetchAllData();
  }, [id]);

  // Update the state
  useEffect(() => {
    if (menus && Object.keys(menus).length > 0) {
      dispatch({ type: "SET_MENUS", payload: menus });
      dispatch({ type: "SET_IS_UPDATED", payload: false });
      dispatch({ type: "SET_TOTAL_PRICE", payload: menus.basePrice });
    }
  }, [menus]);

  useEffect(() => {
    hasOpenedModalRef.current = false;
  }, [state.menus.sizes]);

  // Size selection function
  const handleSizeChange = (e) => {
    const { value } = e.target;
    dispatch({ type: "SET_SELECTED_SIZE", payload: value });
    let additionalPrice = 0;
    state.menus.sizes.forEach((menu) => {
      if (menu.size === value) {
        additionalPrice = menu.additionalPrice;
        dispatch({
          type: "SET_SELECTED_ADDITIONAL_PRICE",
          payload: additionalPrice,
        });
      }
    });
    const basePrice = state.menus.basePrice || 0;
    const totalPrice = basePrice + additionalPrice;
    dispatch({ type: "SET_TOTAL_PRICE", payload: totalPrice });
  };
  // Close modal function
  const handleCloseModal = () => {
    if (!state.menus) {
      return;
    }
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
    const currentLength = (state.menus.sizes || []).length;
    const originalLength = (menus.sizes || []).length;
    if (currentLength > originalLength && !hasOpenedModalRef.current) {
      hasOpenedModalRef.current = true; // set flag so it only happens once
      setTimeout(() => {
        handleOpenModal(
          "Change Ingredients Data",
          <EditIngredientForm
            state={state}
            dispatch={dispatch}
            ingredients={ingredients}
          />,
          "large"
        );
      }, 300);
    }
  };
  // Open modal function
  const handleOpenModal = (title, body, size) => {
    dispatch({ type: "SET_MODAL_TITLE", payload: title });
    dispatch({ type: "SET_MODAL_BODY", payload: body });
    dispatch({ type: "SET_MODAL_SIZE", payload: size });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };
  // Handle clear changes
  const handleClearChanges = () => {
    dispatch({ type: "SET_MENUS", payload: menus });
    dispatch({ type: "SET_IS_UPDATED", payload: false });
    dispatch({ type: "SET_SELECTED_SIZE", payload: "regular" });
    dispatch({ type: "SET_SELECTED_ADDITIONAL_PRICE", payload: 0 });
    dispatch({ type: "SET_TOTAL_PRICE", payload: state.menus.basePrice });
  };
  // Handle save changes
  const handleSaveChanges = async (id, menuData) => {
    await updateMenu(id, menuData);
    fetchProductDetails(id);
  };
  // Handle menu detail change
  const handleMenuChange = (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;
    switch (target.dataset.id) {
      case "name":
        handleOpenModal(
          "Change Menu Name",
          <EditNameForm state={state} dispatch={dispatch} />
        );
        break;
      case "description":
        handleOpenModal(
          "Change Menu Description",
          <EditDescriptionForm state={state} dispatch={dispatch} />
        );
        break;
      case "recipe":
        handleOpenModal(
          "Change Menu Recipe",
          <EditRecipeForm state={state} dispatch={dispatch} />
        );
        break;
      case "status":
        handleOpenModal(
          "Change Menu Status",
          <EditStatusForm state={state} dispatch={dispatch} />
        );
        break;
      case "category":
        handleOpenModal(
          "Change Category Name",
          <EditCategoryForm
            categories={categories}
            state={state}
            dispatch={dispatch}
          />
        );
        break;
      case "basePrice":
        handleOpenModal(
          "Change Base Price",
          <EditBasePriceForm state={state} dispatch={dispatch} />
        );
        break;
      case "availableSize":
        handleOpenModal(
          "Change Available Size",
          <EditAvailableSizeForm state={state} dispatch={dispatch} />
        );
        break;
      case "ingredient":
        handleOpenModal(
          "Change Ingredients Data",
          <EditIngredientForm
            state={state}
            dispatch={dispatch}
            ingredients={ingredients}
          />,
          "large"
        );
        break;
      case "menuImage":
        handleOpenModal(
          "Change Menu Image",
          <EditImageForm state={state} dispatch={dispatch} />
        );
        break;
      default:
        return;
    }
  };
  const Skeleton = () => (
    <div className="animate-[pulse_0.8s_ease-in-out_infinite]  flex flex-col h-[95vh] md:gap-5 gap-2 p-3 md:my-5 my-2 rounded-lg">
      <div className="w-10 p-6 rounded-lg bg-gray-300"></div>
      <div className=" flex md:flex-row flex-col md:gap-5 gap-2 h-full">
        <div className="bg-gray-300 rounded-lg md:absolute lg:inset-x-100 md:inset-x-60 lg:mt-35 md:mt-15 flex items-center md:justify-end w-full md:w-1/2 z-0 p-2 lg:py-40 md:py-30 py-20 "></div>
        <div className="flex flex-col md:w-1/3 w-full h-fit mt-auto p-5 rounded-lg gap-5 bg-gray-200 md:order-1 order-2 z-30">
          <div className="flex flex-row h-10 gap-2 md:justify-between items-center">
            <div className="rounded-lg bg-gray-300 h-full w-md"></div>
            <div className="flex bg-gray-300 gap-2 px-3 py-2 bg-accent rounded-lg h-full w-md"></div>
            <div className="rounded-lg bg-gray-300 h-full w-35"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full h-fit mt-auto justify-end items-end md:order-2 order-1">
          <div className="w-full bg-gray-300 rounded-lg py-5"></div>
          <div className="w-full bg-gray-300 rounded-lg py-5"></div>
        </div>
        <div className="md:w-1/3 w-full z-10 flex flex-col gap-2 md:gap-5 mt-auto h-fit order-3">
          <div className="flex flex-row gap-2 md:gap-5 justify-end md:order-1 order-2 md:pb-0 pb-2">
            <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
            <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
          </div>
          <div className="flex flex-col gap-2 md:gap-5 bg-gray-200 rounded-lg p-5">
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
              <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
              <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
              <div className="rounded-lg bg-gray-300 py-5 w-40"></div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
              <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
              <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (
    isLoadingCategory ||
    isLoadingIngredients ||
    isLoadingProduct ||
    !menus ||
    Object.keys(menus).length === 0
  ) {
    return <Skeleton />;
  }
  return (
    <div className=" md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh] ">
      <Modal
        isOpen={state.isModalOpen}
        title={state.modalTitle}
        body={state.modalBody}
        size={state.modalSize}
        onClose={handleCloseModal}
      />
      <div className="flex flex-col md:gap-5 gap-2 h-full">
        {/* Back Button */}
        <div className="flex justify-between items-center p-1">
          <Button
            buttonSize="icon"
            buttonType="secondary"
            onClick={() => navigate(-1)}
          >
            <LucideIcons.ChevronLeft size={25} />
          </Button>
        </div>
        <div
          onClick={(e) => handleMenuChange(e)}
          className="md:absolute lg:inset-x-100 md:inset-x-60 lg:mt-35 md:mt-25 flex items-center md:justify-end w-full md:w-1/2 z-0 p-2"
        >
          {/* Menu Image */}
          <motion.img
            data-id="menuImage"
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
        <div className=" flex md:flex-row flex-col lg:gap-5 gap-2 h-fit  md:mt-auto">
          {/* Menu Description Detail */}
          <motion.div
            onClick={(e) => handleMenuChange(e)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col lg:w-1/3 md:w-2/5 w-full p-5 rounded-lg gap-5 bg-white mt-auto md:order-1 order-2"
          >
            <div className="flex z-10 flex-wrap md:flex-row gap-2 md:justify-between items-start">
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
              {/* Delete Button */}
              <Button
                icon={LucideIcons.Trash}
                buttonType="danger"
                buttonSize="icon"
                onClick={() => {
                  handleOpenModal(
                    "Change Menu Name",
                    <DeleteConfirmationForm
                      menu={menus}
                      deleteProduct={deleteProduct}
                      navigate={navigate}
                      dispatch={dispatch}
                    />
                  );
                }}
              ></Button>
            </div>
            {/* Menu Name */}
            <h3
              data-id="name"
              className="line-clamp-3 md:max-w-sm max-w-full whitespace-normal truncate hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg px-2"
            >
              {(state.menus?.name || "No Name").replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
            </h3>
            {/* Menu Description */}
            <div
              data-id="description"
              className="hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg p-2 overflow-y-auto max-h-48 scrollbar-hidden"
            >
              <p>{state.menus.description || "No description available "}</p>
            </div>
            {/* Menu Recipe */}
            <div
              data-id="recipe"
              className="gap-2 hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg p-2 overflow-y-auto max-h-49 scrollbar-hidden"
            >
              <h6>Recipe</h6>
              <p>{state.menus.recipe || "No recipe available "}</p>
            </div>
          </motion.div>
          {/* Base Price */}
          <div
            onClick={(e) => handleMenuChange(e)}
            className="flex flex-col gap-2 p-2 md:w-1/3 w-full h-fit mt-auto justify-end items-end md:order-2 order-1 z-10"
          >
            <div
              data-id="basePrice"
              className="flex flex-row w-full justify-between items-center text-dark hover:cursor-pointer hover:scale-101 hover:bg-gray-200 rounded-lg hover:p-2"
            >
              <h6>Base Price</h6>
              <p>
                {state.menus.basePrice
                  ? state.menus.basePrice.toLocaleString("id-ID")
                  : "0"}
              </p>
            </div>
            {/* Additional Price */}
            <AnimatePresence>
              {state.selectedAdditionalPrice > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-row w-full justify-between items-center"
                >
                  <h6>Size Price</h6>
                  <p>{state.selectedAdditionalPrice.toLocaleString("id-ID")}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-row w-full justify-between items-center border-t border-gray-300">
              <h5>Total Price</h5>
              <h6>{state.totalPrice.toLocaleString("id-ID")}</h6>
            </div>
          </div>
          {/* Size & Ingredient Display */}
          <motion.div
            onClick={(e) => handleMenuChange(e)}
            className="md:w-1/3 w-full z-10 flex flex-col gap-2 md:gap-5 mt-auto h-fit order-3"
          >
            {/* CTA */}
            <div className="flex flex-row gap-2 md:gap-5 justify-end md:order-1 order-2 md:pb-0 pb-2">
              <Button
                buttonSize="medium"
                buttonType={`${state.isUpdated ? "secondary" : "disabled"}`}
                onClick={handleClearChanges}
              >
                <LucideIcons.X className="size-6 xl:mr-2 md:mr-0" />
                <span className="xl:inline md:hidden hidden">Discard</span>
              </Button>
              <Button
                buttonSize="medium"
                buttonType={`${state.isUpdated ? "primary" : "disabled"}`}
                onClick={() => handleSaveChanges(id, state.menus)}
              >
                <LucideIcons.Save className="size-6 xl:mr-2 md:mr-0 mr-1" />
                <span className="xl:inline md:hidden inline">Save</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2 md:gap-5 bg-white rounded-lg p-5 md:order-2 order-1">
              <div className="flex flex-row justify-between items-start w-full">
                <RadioInput
                  options={
                    state.menus?.sizes?.map((item) => ({
                      value: item.size,
                      label: item.size.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      ),
                    })) || []
                  }
                  initialValue={state.selectedSize || "regular"}
                  name="selectedSize"
                  label="Available Sizes"
                  onChange={handleSizeChange}
                />
                <Button
                  data-id="availableSize"
                  buttonSize="icon"
                  buttonType="primary"
                  icon={LucideIcons.Pen}
                  className="lg:mt-6"
                ></Button>
              </div>
              {state.menus?.ingredients?.length > 0 ? (
                state.menus.ingredients.map((ingredient, ingredientIndex) => {
                  const selectedIngredient = ingredients.find(
                    (ingredientInList) =>
                      ingredientInList._id === ingredient.ingredientId
                  );

                  const matchedSize = ingredient.quantityBySize.find(
                    (size) => state.selectedSize === size.size
                  );

                  const selectedQuantity = matchedSize?.quantity ?? null;
                  const selectedUnit = matchedSize?.unit ?? null;

                  return selectedIngredient ? (
                    <div
                      data-id="ingredient"
                      className="flex flex-col gap-1"
                      key={`${selectedIngredient._id}-${ingredientIndex}`} // ✅ only key needed
                    >
                      <div className="flex flex-row hover:cursor-pointer hover:scale-101 hover:bg-gray-200 rounded-lg p-2">
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
                          {selectedUnit !== null
                            ? selectedUnit
                            : "No Unit found"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p key={`missing-${ingredient._id || ingredientIndex}`}>
                      Ingredient not found
                    </p>
                  );
                })
              ) : (
                <p>No ingredients available</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
