import { useProductStore } from "../../store/productStore.js";
import { useState } from "react";
import {
  Input,
  TextareaInput,
  DropdownInput,
  CheckboxInput,
  MenuImageInput,
} from "../Input.jsx";
import * as LucideIcons from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button.jsx";

const AddMenuForm = ({ categories, ingredients, onClose }) => {
  const { addNewMenu, fetchProducts } = useProductStore();
  const [step, setStep] = useState(1);
  const [menuData, setMenuData] = useState({
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
  });
  const [errors, setErrors] = useState({});
  const validateStep = () => {
    let newErrors = {};
    // Validate step 1 form
    if (step === 1) {
      if (!String(menuData.name || "").trim())
        newErrors.name = "Name is required.";
      if (Number(menuData.basePrice) < 5000) {
        newErrors.basePrice = "Base price can't lower than 5000";
      }
      if (!String(menuData.categoryId || "").trim()) {
        newErrors.categoryId = "Category is required.";
      }
    } else if (step === 2) {
      menuData.sizes.map((size) => {
        if (size.size !== "regular" && !size.additionalPrice) {
          if (size === "large")
            newErrors.large = "Additional Price is required";
          if (size === "extra large")
            newErrors.extraLarge = "Additional Price is required";
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);
  const handleAddMenu = async (menuData) => {
    await addNewMenu(menuData);
    fetchProducts();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isIngredientDataValid = menuData.ingredientsList.every(
      (ingredient) =>
        ingredient.ingredientId &&
        ingredient.quantityBySize.every((qs) => qs.quantity > 0 && qs.unit)
    );
    if (!isIngredientDataValid) {
      toast.error("Ingredient data is not completed");
      return;
    }
    handleAddMenu(menuData);
    onClose();
  };

  // Step 1 functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({ ...prev, [name]: value }));
    console.log(menuData);
  };

  // Step 2 functions
  // Handle checkbox selection
  const handleSizeChange = (size) => {
    setMenuData((prev) => {
      const isSelected = prev.sizes.some((s) => s.size === size.target.value);
      const updatedSizes = isSelected
        ? prev.sizes.filter((s) => s.size !== size.target.value)
        : [...prev.sizes, { size: size.target.value, additionalPrice: 0 }];

      return {
        ...prev,
        sizes: updatedSizes,
      };
    });
  };

  // Handle additional price change
  const handleAdditionalPriceChange = (size, value) => {
    setMenuData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.size == size ? { ...s, additionalPrice: Number(value) } : s
      ),
    }));
  };

  // Step 3 functions
  const handleAddIngredientClick = () => {
    setMenuData((prev) => ({
      ...prev,
      ingredientsList: [
        ...prev.ingredientsList,
        { count: 1, ingredientId: "" },
      ],
    }));
    console.log(menuData.ingredientsList);
  };
  const handleRemoveIngredient = (index) => {
    setMenuData((prev) => {
      const newList = prev.ingredientsList.filter((_, i) => i !== index);
      return { ...prev, ingredientsList: newList };
    });
  };

  const handleIngredientChange = (index, field, value, size = null) => {
    setMenuData((prev) => {
      const updatedIngredients = prev.ingredientsList.map((ing, i) => {
        if (i === index) {
          if (field === "ingredientId") {
            // 🔥 Safe check to prevent error
            const ingredientData =
              ingredients?.find((ing) => ing._id === value) || null;

            // Ensure quantityBySize matches menuData.sizes
            const updatedQuantityBySize = prev.sizes.map((s) => {
              const existingSize = ing.quantityBySize?.find(
                (qs) => qs.size === s.size
              );
              return {
                size: s.size,
                quantity: existingSize ? existingSize.quantity : 0,
                unit: ingredientData ? ingredientData.unit : "",
              };
            });

            return {
              ...ing,
              ingredientId: value,
              quantityBySize: updatedQuantityBySize,
            };
          } else if (field === "quantityBySize" && size) {
            return {
              ...ing,
              quantityBySize: prev.sizes.map((s) => ({
                size: s.size,
                quantity:
                  s.size === size
                    ? Number(value)
                    : ing.quantityBySize?.find((qs) => qs.size === s.size)
                        ?.quantity || 0,
                unit:
                  ing.quantityBySize?.find((qs) => qs.size === s.size)?.unit ||
                  "",
              })),
            };
          }
        }
        return ing;
      });

      return { ...prev, ingredientsList: updatedIngredients };
    });
  };

  return (
    <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
      {/* Menu Detail */}
      {step === 1 && (
        <div className="flex flex-col w-full gap-2">
          <MenuImageInput
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
                  label={`Additional Price for ${s.size.toUpperCase()}`}
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
          {menuData.sizes.map((size) => {
            return (
              <div key={size.size}>
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
