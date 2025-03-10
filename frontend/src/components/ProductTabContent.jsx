import { useState } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../components/Modal.jsx";
import ProductCard from "./ProductCard.jsx";
import {
  Input,
  TextareaInput,
  DropdownInput,
  FileInput,
  CheckboxInput,
} from "./Input.jsx";
import Button from "./Button.jsx";

const AddMenuForm = ({ ingredients, onClose }) => {
  const [step, setStep] = useState(1);
  const [menuData, setMenuData] = useState({
    name: "",
    price: "",
    status: "Not Available",
    stock: "",
    description: "",
    sizes: [{ size: "regular", additionalPrice: 0 }],
    image: null,
    ingredientsList: [{ count: 1, selectedId: "" }],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Event listener for size
  // Handle checkbox selection
  const handleSizeChange = (size) => {
    console.log(menuData.sizes);
    setMenuData((prev) => {
      const exists = prev.sizes.some((s) => s.size == size.target.value);
      // console.log("menu data" + menuData.sizes);

      if (exists) {
        // Uncheck: Remove the size
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s.size !== size.target.value),
        };
      } else {
        // Check: Add the size with default additionalPrice (0)
        return {
          ...prev,
          sizes: [
            ...prev.sizes,
            { size: size.target.value, additionalPrice: 0 },
          ],
        };
      }
    });
  };

  // Handle additional price change
  const handleAdditionalPriceChange = (size, value) => {
    console.log(size, value);
    setMenuData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.size == size ? { ...s, additionalPrice: Number(value) } : s
      ),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({ ...prev, [name]: value }));
    console.log(menuData);
  };

  const handleFileChange = (e) => {
    console.log(e);
    setMenuData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

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
    console.log(index, selectedId);
    setMenuData((prev) => {
      const newList = prev.ingredientsList.map((ing, i) =>
        i === index ? { ...ing, selectedId } : ing
      );
      return { ...prev, ingredientsList: newList };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Data:", menuData);
  };

  return (
    <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
      {/* Menu Detail */}
      {step === 1 && (
        <div className="w-full flex flex-col gap-3">
          <Input
            type="text"
            placeholder="e.g. Burnt Toast"
            label="Product Name"
            name="name"
            onChange={handleInputChange}
          />
          <Input
            type="number"
            placeholder="e.g. 10.000"
            min="5000"
            label="Base Price"
            name="price"
            onChange={handleInputChange}
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
          <Input
            type="number"
            placeholder="e.g. 100"
            min="1"
            max="100"
            label="Initial Stock"
            name="stock"
            onChange={handleInputChange}
          />
          <TextareaInput
            label="Description"
            placeholder="e.g. Burnt to perfection for exact 29 minutes"
            name="description"
            onChange={handleInputChange}
          />
          <FileInput label="Product Image" onChange={handleFileChange} />
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
                  label={`Additional Price for ${s.size}`}
                  onChange={(e) =>
                    handleAdditionalPriceChange(s.size, e.target.value)
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
            <Button
              icon={LucideIcons.Plus}
              buttonSize="medium"
              buttonType="primary"
              onClick={handleAddIngredientClick}
            />
          </div>

          {menuData.ingredientsList.map((ing, index) => (
            <div key={index} className="flex flex-row items-end gap-3">
              <DropdownInput
                label="Ingredient"
                options={ingredients.map((ingredient) => ({
                  value: String(ingredient._id),
                  label: ingredient.name,
                }))}
                value={ing.selectedId}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
              />

              <Input type="number" min="1" max="100" label="Quantity" />
              <p>
                {ingredients.find((ingr) => ingr._id === ing.selectedId)
                  ?.unit || "Select Ingredient"}
              </p>
              <button
                type="button"
                className="text-gray-500 hover:text-red-400 bg-transparent hover:bg-red-100 p-2 rounded-lg"
                onClick={() => handleRemoveIngredient(index)}
              >
                <LucideIcons.X />
              </button>
            </div>
          ))}
          <Button
            type="button"
            buttonType="secondary"
            buttonSize="large"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button type="submit" buttonType="primary" buttonSize="large">
            Submit
          </Button>
        </div>
      )}
    </form>
  );
};
const ProductTabContent = ({
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
            openModal("Add New Menu", <AddMenuForm ingredients={ingredients} />)
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
