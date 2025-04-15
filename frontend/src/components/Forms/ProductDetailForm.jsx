import { useEffect, useState, useRef } from "react";
import {
  DropdownInput,
  Input,
  TextareaInput,
  CheckboxInput,
  ImageInput,
} from "../Input";
import * as LucideIcons from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button";

export const EditStatusForm = ({ state, dispatch }) => {
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
export const EditCategoryForm = ({ categories, state, dispatch }) => {
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
export const EditNameForm = ({ state, dispatch }) => {
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
export const EditDescriptionForm = ({ state, dispatch }) => {
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
export const EditRecipeForm = ({ state, dispatch }) => {
  const [localRecipe, setLocalRecipe] = useState(state.menus.localRecipe || "");
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
export const EditBasePriceForm = ({ state, dispatch }) => {
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
export const EditAvailableSizeForm = ({ state, dispatch }) => {
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
export const EditIngredientForm = ({ state, dispatch, ingredients }) => {
  const toastShownRef = useRef(false);
  const [ingredientData, setIngredientData] = useState(
    state.menus.ingredients || []
  );

  useEffect(() => {
    setIngredientData(state.menus.ingredients || []);
  }, [state.menus.ingredients]);

  useEffect(() => {
    const updatedIngredients = (state.menus.ingredients || []).map(
      (ingredient) => {
        const existingSizes = ingredient.quantityBySize.map((q) => q.size);
        const missingSizes = state.menus.sizes.filter(
          (s) => !existingSizes.includes(s.size)
        );

        const updatedQtyBySize = [
          ...ingredient.quantityBySize,
          ...missingSizes.map((s) => ({
            size: s.size,
            quantity: 0,
            unit:
              ingredients.find((ing) => ing._id === ingredient.ingredientId)
                ?.unit || "",
          })),
        ];

        return { ...ingredient, quantityBySize: updatedQtyBySize };
      }
    );
    setIngredientData(updatedIngredients);
    dispatch({
      type: "SET_MENUS",
      payload: {
        ...state.menus,
        ingredients: updatedIngredients,
      },
    });
  }, [state.menus.sizes]);

  const handleIngredientChange = (index, field, value, size = null) => {
    const updatedIngredients = ingredientData.map((ingredient, i) => {
      if (i !== index) return ingredient;

      if (field === "ingredientId") {
        const selectedIngredient = ingredients.find((ing) => ing._id === value);
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
                      options={ingredients
                        .filter((ing) => {
                          const isSelectedElsewhere = ingredientData.some(
                            (otherIng, otherIndex) =>
                              otherIndex !== index &&
                              otherIng.ingredientId === ing._id
                          );
                          const isCurrentIngredient =
                            ingredient.ingredientId === ing._id;
                          return !isSelectedElsewhere || isCurrentIngredient;
                        })
                        .map((ingredientOption) => ({
                          value: String(ingredientOption._id),
                          label: ingredientOption.name,
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
export const DeleteConfirmationForm = ({
  menu,
  deleteProduct,
  navigate,
  dispatch,
}) => {
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
        <p className="select-none">
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

export const EditImageForm = ({ state, dispatch }) => {
  return (
    <ImageInput
      label="Product Image"
      onFileChange={(file) => console.log("Uploaded File:", file)}
    />
  );
};
