import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../components/Modal.jsx";
import ProductCard from "./ProductCard.jsx";
import { useProductStore } from "../store/productStore.js";
import {
  Input,
  TextareaInput,
  DropdownInput,
  FileInput,
  CheckboxInput,
  MenuImageInput,
} from "./Input.jsx";
import Button from "./Button.jsx";
import toast from "react-hot-toast";

const AddMenuForm = ({ categories, ingredients, onClose }) => {
  const { addNewMenu, fetchProducts } = useProductStore();
  const [step, setStep] = useState(1);
  const [menuData, setMenuData] = useState({
    name: "",
    basePrice: 0,
    categoryId: "",
    status: "Not Available",
    initialStock: 0,
    description: "",
    sizes: [{ size: "regular", additionalPrice: 0 }],
    image: null,
    ingredientsList: [{ count: 1, selectedId: "" }],
    recipe: "",
  });
  const [errors, setErrors] = useState({});
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      newErrors = {
        ...(menuData.name.trim() ? {} : { name: "Name is required." }),
        ...(menuData.basePrice < 5000
          ? { basePrice: "Base price can't be lower than 5000." }
          : {}),
        ...(menuData.categoryId.trim()
          ? {}
          : { categoryId: "Category is required." }),
        ...(menuData.initialStock.trim()
          ? {}
          : { initialStock: "Initial Stock is required." }),
        ...(menuData.initialStock > 100
          ? { initialStock: "Maximal stock is 100." }
          : {}),
      };
    } else if (step === 2) {
      menuData.sizes.forEach((size) => {
        if (size.size !== "regular" && !size.additionalPrice) {
          newErrors[size.size] = "Additional Price is required";
        }
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (
    //   menuData.ingredientsList.some(
    //     (ingredient) => ingredient.selectedId !== ""
    //   )
    // ) {
    //   toast.error("Ingredient data is not completed");
    // }
    addNewMenu(menuData);
    fetchProducts();
  };

  // Step 1 functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({ ...prev, [name]: value }));
    console.log(menuData);
  };

  const handleFileChange = (e) => {
    setMenuData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Step 2 functions
  // Handle checkbox selection
  const handleSizeChange = (size) => {
    setMenuData((prev) => {
      const isSelected = prev.sizes.some((s) => s.size === size.target.value);
      return {
        ...prev,
        sizes: isSelected
          ? prev.sizes.filter((s) => s.size !== size.target.value)
          : [...prev.sizes, { size: size.target.value, additionalPrice: 0 }],
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
      ingredientsList: [...prev.ingredientsList, { count: 1, selectedId: "" }],
    }));
  };
  const handleRemoveIngredient = (index) => {
    setMenuData((prev) => {
      const newList = prev.ingredientsList.filter((_, i) => i !== index);
      return { ...prev, ingredientsList: newList };
    });
  };

  const handleIngredientChange = (index, selectedId) => {
    setMenuData((prev) => {
      const newList = prev.ingredientsList.map((ing, i) =>
        i === index ? { ...ing, selectedId } : ing
      );
      return { ...prev, ingredientsList: newList };
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
          <Input
            type="number"
            placeholder="e.g. 100"
            min="1"
            max="100"
            value={menuData.initialStock}
            label="Initial Stock"
            name="initialStock"
            onChange={handleInputChange}
            error={errors.initialStock}
          />
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
          {menuData.ingredientsList.map((ing, index) => (
            <div key={index} className="flex flex-row gap-2 items-end">
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
                  value={ing.selectedId}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                />

                <Input
                  className="w-1/2"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 100"
                />
              </div>
              <p className="mb-3 font-semibold">
                {ingredients.find((ingr) => ingr._id === ing.selectedId)
                  ?.unit || ""}
              </p>
            </div>
          ))}
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

const ProductTabContent = ({
  categories,
  activeTab,
  ingredients,
  products,
  isLoadingProducts,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setModalOpen(true);
  };

  const handleProductClick = (event) => {
    const card = event.target.closest("[data-id]");
    if (!card) return;

    const productId = card.getAttribute("data-id");
    const product = products.find((p) => p._id === productId);

    if (product) {
      setSelectedProduct(product);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button
          className="mx-1 "
          buttonType="primary"
          buttonSize="icon"
          onClick={() =>
            openModal(
              "Add New Menu",
              <AddMenuForm categories={categories} ingredients={ingredients} />
            )
          }
        >
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        body={modalBody}
      />
      <div
        className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 gap-2 p-2 overflow-y-auto scrollbar-hidden"
        onClick={handleProductClick}
      >
        {/* <div key={product._id} > */}
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCard
              product={product}
              buttonLabel={"Edit"}
              key={product._id}
              data-id={product._id}
              isLoading={isLoadingProducts}
            ></ProductCard>
          ))
        ) : (
          <p>No products available</p>
        )}
        {/* </div> */}
      </div>
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </Modal>
      )}
    </div>
  );
};

export default ProductTabContent;
