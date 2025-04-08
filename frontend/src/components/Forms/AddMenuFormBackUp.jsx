import { useProductStore } from "../../store/productStore.js";
import { useReducer, useCallback } from "react";
import {
  Input,
  TextareaInput,
  DropdownInput,
  CheckboxInput,
  ImageInput,
} from "../Input.jsx";
import * as LucideIcons from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button.jsx";

const AddMenuForm = ({ categories, ingredients, onClose }) => {
  const { addNewMenu, fetchProducts } = useProductStore();

  const initialState = {
    step: 1,
    errors: {},
    menuData: {
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
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "SET_ERRORS":
        return { ...state, errors: action.payload };

      case "CLEAR_ERRORS":
        return { ...state, errors: {} };

      case "SET_STEP":
        return { ...state, step: action.payload };

      case "UPDATE_MENU":
        return {
          ...state,
          menuData: { ...state.menuData, ...action.payload },
        };

      case "TOGGLE_SIZE": {
        const isSelected = state.menuData.sizes.some(
          (s) => s.size === action.payload
        );
        return {
          ...state,
          menuData: {
            ...state.menuData,
            sizes: isSelected
              ? state.menuData.sizes.filter((s) => s.size !== action.payload)
              : [
                  ...state.menuData.sizes,
                  { size: action.payload, additionalPrice: 0 },
                ],
          },
        };
      }

      case "UPDATE_ADDITIONAL_PRICE":
        return {
          ...state,
          menuData: {
            ...state.menuData,
            sizes: state.menuData.sizes.map((s) =>
              s.size === action.payload.size
                ? { ...s, additionalPrice: action.payload.value }
                : s
            ),
          },
        };

      case "ADD_INGREDIENT":
        return {
          ...state,
          menuData: {
            ...state.menuData,
            ingredientsList: [
              ...state.menuData.ingredientsList,
              {
                ingredientId: "",
                quantityBySize: state.menuData.sizes.map((s) => ({
                  size: s.size,
                  quantity: 0,
                  unit: "",
                })),
              },
            ],
          },
        };

      case "REMOVE_INGREDIENT":
        return {
          ...state,
          menuData: {
            ...state.menuData,
            ingredientsList: state.menuData.ingredientsList.filter(
              (_, i) => i !== action.payload
            ),
          },
        };

      case "UPDATE_INGREDIENT":
        return {
          ...state,
          menuData: {
            ...state.menuData,
            ingredientsList: state.menuData.ingredientsList.map((ing, i) => {
              if (i === action.payload.index) {
                if (action.payload.field === "ingredientId") {
                  const ingredientData =
                    ingredients.find(
                      (ing) => ing._id === action.payload.value
                    ) || null;

                  return {
                    ...ing,
                    ingredientId: action.payload.value,
                    quantityBySize: state.menuData.sizes.map((s) => ({
                      size: s.size,
                      quantity: 0,
                      unit: ingredientData ? ingredientData.unit : "",
                    })),
                  };
                } else if (
                  action.payload.field === "quantityBySize" &&
                  action.payload.size
                ) {
                  return {
                    ...ing,
                    quantityBySize: state.menuData.sizes.map((s) => ({
                      size: s.size,
                      quantity:
                        s.size === action.payload.size
                          ? Number(action.payload.value)
                          : 0,
                      unit:
                        ing.quantityBySize?.find((qs) => qs.size === s.size)
                          ?.unit || "",
                    })),
                  };
                }
              }
              return ing;
            }),
          },
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialState);
  const { step, errors, menuData } = state;

  const validateForm = () => {
    let newErrors = {};

    if (step === 1) {
      if (!menuData.name.trim()) newErrors.name = "Name is required.";
      if (menuData.basePrice < 5000)
        newErrors.basePrice = "Base price can't be lower than 5000.";
      if (!menuData.categoryId.trim())
        newErrors.categoryId = "Category is required.";
    }

    if (step === 2) {
      menuData.sizes.forEach((size) => {
        if (size.size !== "regular" && !size.additionalPrice) {
          newErrors[size.size] = "Additional Price is required";
        }
      });
    }

    if (step === 3) {
      if (
        !menuData.ingredientsList.every(
          (ingredient) =>
            ingredient.ingredientId &&
            ingredient.quantityBySize.every((qs) => qs.quantity > 0 && qs.unit)
        )
      ) {
        toast.error(
          "Ingredient data is incomplete. Please fill in all required fields."
        );
        return false;
      }
    }

    dispatch({ type: "SET_ERRORS", payload: newErrors });

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateForm()) {
      dispatch({ type: "SET_STEP", payload: step + 1 });
    }
  };

  const prevStep = () => dispatch({ type: "SET_STEP", payload: step - 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      addNewMenu(menuData);
      fetchProducts();
      onClose();
    }
  };

  const handleInputChange = useCallback((e) => {
    dispatch({
      type: "UPDATE_MENU",
      payload: { [e.target.name]: e.target.value },
    });
  }, []);

  const handleSizeChange = useCallback((size) => {
    dispatch({ type: "TOGGLE_SIZE", payload: size });
  }, []);

  const handleAdditionalPriceChange = useCallback((size, value) => {
    dispatch({
      type: "UPDATE_ADDITIONAL_PRICE",
      payload: { size, value: Number(value) },
    });
  }, []);

  const handleAddIngredientClick = useCallback(() => {
    dispatch({ type: "ADD_INGREDIENT" });
  }, []);

  const handleRemoveIngredient = useCallback((index) => {
    dispatch({ type: "REMOVE_INGREDIENT", payload: index });
  }, []);

  const handleIngredientChange = useCallback(
    (index, field, value, size = null) => {
      dispatch({
        type: "UPDATE_INGREDIENT",
        payload: { index, field, value, size },
      });
    },
    []
  );

  return (
    <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
      {/* Menu Detail */}
      {step === 1 && (
        <div className="flex flex-col w-full gap-2">
          <ImageInput
            label="Product Image"
            onFileChange={(file) => console.log("Uploaded File:", file)}
          />
          <div className="grid grid-cols-2 gap-5 items-center">
            <Input
              className="w-full"
              type="text"
              placeholder="e.g. Burnt Toast"
              label="Product Name"
              name="name"
              value={menuData.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <DropdownInput
              label="Category"
              name="categoryId"
              value={menuData.categoryId}
              options={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
              onChange={handleInputChange}
              error={errors.categoryId}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-5 items-center">
            <Input
              type="number"
              min="5000"
              label="Base Price"
              name="basePrice"
              value={menuData.basePrice}
              onChange={handleInputChange}
              error={errors.basePrice}
              placeholder="e.g. 10.000"
            />
            <DropdownInput
              label="Status"
              name="status"
              value={menuData.status}
              options={[
                { value: "Available", label: "Available" },
                { value: "Not Available", label: "Not Available" },
              ]}
              onChange={handleInputChange}
            />
          </div>
          <TextareaInput
            label="Description"
            placeholder="e.g. Burnt to perfection for exact 29 minutes"
            name="description"
            value={menuData.description}
            onChange={handleInputChange}
          />

          <Button
            className="w-fit ml-auto"
            type="button"
            buttonType="primary"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      )}
      {/* Menu Available Sizes */}
      {step === 2 && (
        <div className="w-full flex flex-col gap-3">
          <CheckboxInput
            label="Size"
            name="size"
            initialValue={menuData.sizes.map((s) => s.size)}
            options={[
              { value: "regular", label: "Regular" },
              { value: "large", label: "Large" },
              { value: "extra large", label: "Extra Large" },
            ]}
            onChange={handleSizeChange}
          />
          {/* Additional Price Inputs */}
          {menuData.sizes
            .filter((s) => s.size !== "regular")
            .map((s) => (
              <div key={s.size}>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  required={true}
                  min="1"
                  max="100000"
                  label={`Additional Price for ${String(s.size).toUpperCase()}`}
                  value={
                    menuData.sizes.find((size) => size.size === s.size)
                      ?.additionalPrice || ""
                  }
                  onChange={(e) =>
                    handleAdditionalPriceChange(s.size, e.target.value)
                  }
                  error={
                    s.size === "large"
                      ? errors.large
                      : s.size === "extra large"
                      ? errors.extraLarge
                      : ""
                  }
                />
              </div>
            ))}
          <div className="flex flex-row w-full md:gap-5 gap-2 items-center justify-end">
            <Button type="button" buttonType="secondary" onClick={prevStep}>
              Back
            </Button>
            <Button type="button" buttonType="primary" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Recipe & Direction */}
      {step === 3 && (
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-row w-full justify-between items-center">
            <h6>Ingredients & Direction</h6>
            <Button
              buttonSize="medium"
              buttonType="primary"
              onClick={handleAddIngredientClick}
            >
              Add
              <LucideIcons.Plus />
            </Button>
          </div>
          <div className="grid grid-cols-2 items-center w-full text-center">
            <p>Ingredient</p>
            <p>Quantity</p>
          </div>
          {menuData.sizes.map((size, sizeIndex) => {
            return (
              <div key={sizeIndex}>
                <h6>
                  {size.size.replace(/\b\w/g, (char) => char.toUpperCase())}
                </h6>
                {menuData.ingredientsList.map((ing, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 py-1 items-end"
                  >
                    <Button
                      className="w-fit mb-2"
                      buttonSize="icon"
                      buttonType="danger"
                      onClick={() => handleRemoveIngredient(index)}
                      icon={LucideIcons.Trash}
                    />
                    <div className="grid grid-cols-2 gap-2 items-center w-full">
                      <DropdownInput
                        className="w-1/2"
                        options={ingredients.map((ingredient) => ({
                          value: String(ingredient._id),
                          label: ingredient.name,
                        }))}
                        value={ing.ingredientId}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "ingredientId",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        className="w-1/2"
                        type="number"
                        min="1"
                        max="100"
                        placeholder="e.g. 100"
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantityBySize",
                            e.target.value,
                            size.size
                          )
                        }
                        error={errors[`ingredient-${index}-${size.size}`]}
                      />
                    </div>
                    <p className="mb-3 font-semibold">
                      {ingredients.find((ingr) => ingr._id === ing.ingredientId)
                        ?.unit || ""}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
          <TextareaInput
            label="Directions"
            placeholder="e.g. Put perfectly fine bread on toaster for 29 minutes"
            name="recipe"
            value={menuData.recipe}
            rows="5"
            onChange={handleInputChange}
          />
          <div className="flex flex-row w-full md:gap-5 gap-2 items-center justify-end">
            <Button type="button" buttonType="secondary" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" buttonType="primary">
              Save
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddMenuForm;
