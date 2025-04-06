import { useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCategoryStore } from "../store/categoryStore.js";
import { useIngredientStore } from "../store/ingredientStore.js";
import { useEffect, useReducer, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { placeholder } from "../assets/index.js";
import {
  RadioInput,
  DropdownInput,
  Input,
  TextareaInput,
  CheckboxInput,
} from "../components/Input";
import * as LucideIcons from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal.jsx";
import toast from "react-hot-toast";

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
        const newMenus = { ...state.menus, ...action.payload };
        return { ...state, menus: newMenus, isUpdated: true };
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

  const EditStatusForm = ({ state, dispatch }) => {
    const handleChangeStatus = (e) => {
      const { value } = e.target;
      dispatch({ type: "SET_MENUS", payload: { status: value } });
    };
    return (
      <DropdownInput
        label="Status"
        name="status"
        value={state.menus.status || "Not Available"}
        options={[
          { value: "Available", label: "Available" },
          { value: "Not Available", label: "Not Available" },
        ]}
        onChange={handleChangeStatus}
      />
    );
  };
  const EditCategoryForm = ({ categories, state, dispatch }) => {
    const handleCategoryChange = (e) => {
      const { value } = e.target;
      dispatch({ type: "SET_MENUS", payload: { categoryId: value } });
    };
    return (
      <DropdownInput
        label="Category"
        name="categoryId"
        value={state.menus.categoryId || ""}
        options={categories.map((category) => ({
          value: category._id,
          label: category.name,
        }))}
        onChange={handleCategoryChange}
      />
    );
  };
  const EditNameForm = ({ state, dispatch }) => {
    const [localName, setLocalName] = useState(state.menus.name || "");
    useEffect(() => {
      setLocalName(state.menus.name);
    }, [state.menus.name]);
    const handleChangeName = (e) => {
      setLocalName(e.target.value);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, name: e.target.value },
      });
    };
    return (
      <Input
        className="w-full"
        type="text"
        placeholder="e.g. Burnt Toast"
        label="Menu Name"
        name="name"
        value={localName}
        onChange={handleChangeName}
      />
    );
  };
  const EditDescriptionForm = ({ state, dispatch }) => {
    const [localDescription, setLocalDescription] = useState(
      state.menus.description || ""
    );
    useEffect(() => {
      setLocalDescription(state.menus.description);
    }, [state.menus.description]);
    const handleChangeDescription = (e) => {
      setLocalDescription(e.target.value);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, description: e.target.value },
      });
    };
    return (
      <TextareaInput
        className="w-full"
        type="text"
        placeholder="e.g. Burnt to perfection for exact 29 minutes"
        label="Menu Description"
        name="description"
        rows="3"
        value={localDescription}
        onChange={handleChangeDescription}
      />
    );
  };
  const EditRecipeForm = ({ state, dispatch }) => {
    const [localRecipe, setLocalRecipe] = useState(
      state.menus.localRecipe || ""
    );
    useEffect(() => {
      setLocalRecipe(state.menus.recipe);
    }, [state.menus.recipe]);
    const handleChangeRecipe = (e) => {
      setLocalRecipe(e.target.value);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, recipe: e.target.value },
      });
    };
    return (
      <TextareaInput
        label="Directions"
        placeholder="e.g. Put perfectly fine bread on toaster for 29 minutes"
        name="recipe"
        value={localRecipe}
        rows="5"
        onChange={handleChangeRecipe}
      />
    );
  };
  const EditBasePriceForm = ({ state, dispatch }) => {
    const [localBasePrice, setLocalBasePrice] = useState(
      state.menus.basePrice || 0
    );
    const [localTotalPrice, setLocalTotalPrice] = useState(
      state.menus.basePrice + state.selectedAdditionalPrice
    );
    useEffect(() => {
      setLocalBasePrice(state.menus.basePrice);
    }, [state.menus.basePrice]);
    useEffect(() => {
      const total =
        Number(localBasePrice) + Number(state.selectedAdditionalPrice || 0);
      setLocalTotalPrice(total);
      dispatch({ type: "SET_TOTAL_PRICE", payload: total });
    }, [localBasePrice, state.selectedAdditionalPrice, dispatch]);

    const handleBasePriceChange = (e) => {
      const value = Number(e.target.value);
      setLocalBasePrice(value);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, basePrice: value },
      });
    };

    return (
      <Input
        type="number"
        min="5000"
        label="Base Price"
        name="basePrice"
        value={localBasePrice}
        onChange={handleBasePriceChange}
        placeholder="e.g. 10.000"
      />
    );
  };
  const EditAvailableSizeForm = ({ state, dispatch }) => {
    const [availableSize, setAvailableSize] = useState(state.menus.sizes || []);
    useEffect(() => {
      setAvailableSize(state.menus.sizes || []);
    }, [state.menus.sizes]);

    const handleSizeChange = (e) => {
      const selectedSize = e.target.value;
      const exists = availableSize.find((s) => s.size === selectedSize);

      if (selectedSize === "regular" && exists) return;
      const updatedSizes = exists
        ? availableSize.filter((s) => s.size !== selectedSize)
        : [...availableSize, { size: selectedSize, additionalPrice: 0 }];

      setAvailableSize(updatedSizes);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, sizes: updatedSizes },
      });
      dispatch({ type: "SET_SELECTED_SIZE", payload: "regular" });
    };

    const handleAdditionalPriceChange = (size, price) => {
      const updatedSizes = availableSize.map((s) =>
        s.size === size ? { ...s, additionalPrice: Number(price) } : s
      );
      setAvailableSize(updatedSizes);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, sizes: updatedSizes },
      });
      dispatch({ type: "SET_SELECTED_SIZE", payload: "regular" });
    };

    return (
      <div className="w-full flex flex-col gap-3">
        <CheckboxInput
          label="Size"
          name="size"
          initialValue={availableSize.map((s) => s.size)}
          options={[
            { value: "regular", label: "Regular", disabled: true },
            { value: "large", label: "Large" },
            { value: "extra large", label: "Extra Large" },
          ]}
          onChange={handleSizeChange}
        />

        {availableSize
          .filter((s) => s.size !== "regular")
          .map((s) => (
            <div key={s.size}>
              <Input
                type="number"
                placeholder="e.g. 5000"
                required
                min="1"
                max="100000"
                label={`Additional Price for ${s.size.toUpperCase()}`}
                value={s.additionalPrice}
                onChange={(e) =>
                  handleAdditionalPriceChange(s.size, e.target.value)
                }
              />
            </div>
          ))}
      </div>
    );
  };
  const EditIngredientForm = ({ state, dispatch }) => {
    const toastShownRef = useRef(false);
    const [ingredientData, setIngredientData] = useState(
      state.menus.ingredients || []
    );

    useEffect(() => {
      setIngredientData(state.menus.ingredients || []);
    }, [state.menus.ingredients]);

    const handleIngredientChange = (index, field, value, size = null) => {
      const updatedIngredients = ingredientData.map((ingredient, i) => {
        if (i !== index) return ingredient;

        if (field === "ingredientId") {
          const selectedIngredient = ingredients.find(
            (ing) => ing._id === value
          );
          const newQuantityBySize = state.menus.sizes.map((s) => ({
            size: s.size,
            quantity: 0,
            unit: selectedIngredient?.unit || "",
          }));

          return {
            ...ingredient,
            ingredientId: value,
            quantityBySize: newQuantityBySize,
          };
        }

        if (field === "quantityBySize" && size) {
          const updatedQtyBySize = ingredient.quantityBySize.map((qs) =>
            qs.size === size ? { ...qs, quantity: Number(value) } : qs
          );

          return { ...ingredient, quantityBySize: updatedQtyBySize };
        }

        return ingredient;
      });

      setIngredientData(updatedIngredients);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, ingredients: updatedIngredients },
      });
    };

    const handleAddIngredient = () => {
      const newIngredient = {
        ingredientId: "",
        quantityBySize: state.menus.sizes.map((s) => ({
          size: s.size,
          quantity: 0,
          unit: "",
        })),
      };

      const updatedList = [...ingredientData, newIngredient];
      setIngredientData(updatedList);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, ingredients: updatedList },
      });
    };

    const handleRemoveIngredient = (index) => {
      const updatedList = ingredientData.filter((_, i) => i !== index);
      if (ingredientData.length === 1) {
        if (!toastShownRef.current) {
          toast.error("Ingredient can't be empty");
          toastShownRef.current = true;
          setTimeout(() => {
            toastShownRef.current = false;
          }, 4000); // prevent spam for 1.5 seconds
        }
        return;
      }

      setIngredientData(updatedList);
      dispatch({
        type: "SET_MENUS",
        payload: { ...state.menus, ingredients: updatedList },
      });
    };

    return (
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Button
            buttonSize="medium"
            buttonType="primary"
            onClick={handleAddIngredient}
          >
            Add <LucideIcons.Plus />
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          {state.menus.sizes.map((size, sizeIndex) => (
            <div
              key={size.size}
              className="w-full bg-white-shadow p-3 rounded-lg"
            >
              <h6 className="capitalize">{size.size}</h6>
              {ingredientData.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 py-1 items-center"
                >
                  {sizeIndex < 1 && (
                    <Button
                      className="w-fit"
                      buttonSize="icon"
                      buttonType="danger"
                      onClick={() => handleRemoveIngredient(index)}
                      icon={LucideIcons.Minus}
                    />
                  )}
                  <div className="grid grid-cols-5 gap-2 items-center w-full">
                    <div className="col-span-4">
                      <DropdownInput
                        options={ingredients.map((ing) => ({
                          value: ing._id,
                          label: ing.name,
                        }))}
                        value={ingredient.ingredientId}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "ingredientId",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        className="w-1/5"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="e.g. 100"
                        value={
                          ingredient.quantityBySize.find(
                            (qs) => qs.size === size.size
                          )?.quantity || ""
                        }
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantityBySize",
                            e.target.value,
                            size.size
                          )
                        }
                      />
                    </div>
                  </div>
                  <p className="mb-3 font-semibold">
                    {ingredients.find(
                      (ing) => ing._id === ingredient.ingredientId
                    )?.unit || ""}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const DeleteConfirmationForm = ({ menu }) => {
    const [confirmationText, setConfirmationText] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (confirmationText !== menu.name.trim()) {
        toast.error("Confirmation does not match");
        return;
      }
      await deleteProduct(menu._id);
      setTimeout(() => {
        navigate(-1);
        toast.success("Product deleted successfully");
      }, 1000);
      dispatch({ type: "SET_MODAL_OPEN", payload: false });
    };
    return (
      <form
        className="flex flex-col gap-3 overflow-y-auto p-2 scrollbar-hidden"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col gap-3">
          <p>
            Please retype <span className="font-semibold">{menu.name}</span> to
            confirm deletion.
          </p>
          <Input
            type="text"
            label="Confirmation"
            name="confirmation"
            onChange={(e) => {
              setConfirmationText(e.target.value);
            }}
          />
        </div>
        <Button
          type="submit"
          buttonType="danger"
          buttonSize="large"
          className="w-fit items-end"
        >
          Confirm
          <LucideIcons.Trash2Icon />
        </Button>
      </form>
    );
  };
  // Initial data load form database
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchProductDetails(id);
      await fetchIngredients();
      await fetchCategories();
    };
    fetchAllData();
  }, [id]);
  // Update the state
  useEffect(() => {
    if (menus && Object.keys(menus).length > 0) {
      dispatch({ type: "SET_MENUS", payload: menus });
      dispatch({ type: "SET_IS_UPDATED", payload: false });
      dispatch({ type: "SET_TOTAL_PRICE", payload: state.menus.basePrice });
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
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
    const currentLength = (state.menus.sizes || []).length;
    const originalLength = (menus.sizes || []).length;
    if (currentLength > originalLength && !hasOpenedModalRef.current) {
      hasOpenedModalRef.current = true; // set flag so it only happens once
      setTimeout(() => {
        handleOpenModal(
          "Change Ingredients Data",
          <EditIngredientForm state={state} dispatch={dispatch} />,
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
          <EditIngredientForm state={state} dispatch={dispatch} />,
          "large"
        );
        break;
      default:
        return;
    }
  };
  const Skeleton = () => (
    <div className="animate-pulse flex flex-col h-[95vh] md:gap-5 gap-2 p-3 md:my-5 my-2 rounded-lg">
      <div className="w-10 p-6 rounded-lg bg-gray-300"></div>
      <div className=" flex flex-row md:gap-5 gap-2 h-full">
        <div className="flex flex-col w-1/3 h-fit mt-auto p-5 rounded-lg gap-5 bg-gray-200">
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
        <div className="flex flex-col gap-2 p-2 w-1/3 h-fit mt-auto justify-end items-end">
          <div
            data-id="basePrice"
            className="w-full bg-gray-300 rounded-lg py-5"
          ></div>
          <div
            data-id="basePrice"
            className="w-full bg-gray-300 rounded-lg py-5"
          ></div>
        </div>
        <div className="w-1/3 z-10 flex flex-col gap-2 md:gap-5 mt-auto h-fit">
          <div className="flex flex-row gap-2 md:gap-5 justify-end">
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
    !state.menus
  ) {
    return <Skeleton />;
  }
  return (
    <div className=" md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
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
        <div className="absolute inset-x-100 pt-50 flex items-center justify-end w-1/2 z-0 p-2">
          {/* Menu Image */}
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
        <div className=" flex flex-row md:gap-5 gap-2 h-fit  mt-auto">
          {/* Menu Description Detail */}
          <motion.div
            onClick={(e) => handleMenuChange(e)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col w-1/3 p-5 rounded-lg gap-5 bg-white mt-auto"
          >
            <div className="flex z-10  flex-row gap-2 md:justify-between items-center">
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
                    <DeleteConfirmationForm menu={menus} />
                  );
                }}
              ></Button>
            </div>
            {/* Menu Name */}
            <h1
              data-id="name"
              className="line-clamp-3 max-w-sm whitespace-normal hover:cursor-pointer hover:scale-101 hover:bg-gray-100 rounded-lg px-2"
            >
              {state.menus.name.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              ) || "No Name"}
            </h1>
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
            className="flex flex-col gap-2 p-2 w-1/3 h-fit mt-auto justify-end items-end"
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
          {/* Size & Ingredient Display */}
          <motion.div
            onClick={(e) => handleMenuChange(e)}
            className="w-1/3 z-10 flex flex-col gap-2 md:gap-5 mt-auto h-fit"
          >
            {/* CTA */}
            <div className="flex flex-row gap-2 md:gap-5 justify-end">
              <Button
                buttonSize="medium"
                buttonType={`${state.isUpdated ? "secondary" : "disabled"}`}
                onClick={handleClearChanges}
              >
                Clear Changes
              </Button>
              <Button
                buttonSize="medium"
                buttonType={`${state.isUpdated ? "primary" : "disabled"}`}
                onClick={() => handleSaveChanges(id, state.menus)}
              >
                Save Changes
              </Button>
            </div>
            <div className="flex flex-col gap-2 md:gap-5 bg-white rounded-lg p-5">
              <div className="flex flex-row justify-between items-center w-full">
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
                  className="mt-6"
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
