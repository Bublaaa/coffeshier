import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../components/Modal.jsx";
import ProductCard from "./ProductCard.jsx";
import { useProductStore } from "../store/productStore.js";
import { useIngredientStore } from "../store/ingredientStore.js";
import { Input, TextareaInput, DropdownInput, FileInput } from "./Input.jsx";
import Button from "./Button.jsx";

const AddMenuForm = ({ ingredients }) => {
  const [step, setStep] = useState(1);
  const [menuData, setMenuData] = useState({
    name: "",
    price: "",
    status: "Not Available",
    stock: "",
    description: "",
    image: null,
    ingredientsList: [{ count: 1, selectedId: "" }],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

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
            type="button"
            buttonType="primary"
            buttonSize="large"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      )}
      {/* Recipe & Direction */}
      {step === 2 && (
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
const ProductTabContent = ({ activeTab }) => {
  const {
    ingredients,
    fetchIngredients,
    isLoading: isLoadingIngredients,
    error: ingredientError,
  } = useIngredientStore();
  const {
    products,
    fetchProducts,
    isLoading: isLoadingProducts,
    error: productError,
  } = useProductStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  useEffect(() => {
    fetchIngredients();
    fetchProducts();
  }, []);

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
        className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 md:gap-5 gap-2 p-2 overflow-y-auto scrollbar-hidden"
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
