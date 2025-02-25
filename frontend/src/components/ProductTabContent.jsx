import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { placeholder } from "../assets/index.js";
import Modal from "../components/Modal.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const Skeleton = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            className="animate-[pulse_0.8s_ease-in-out_infinite] flex flex-col max-w-xs h-full gap-2 bg-gray-300 p-3 rounded-xl"
            key={index}
          >
            <div className="w-full h-40 rounded-lg bg-gray-200"></div>
            <div className="flex flex-col gap-2">
              <div className="flex w-full gap-2 items-center justify-between">
                <div className="bg-gray-200 p-4 rounded-lg w-full"></div>
                <div className="bg-gray-200 p-4 rounded-lg w-[20px]"></div>
              </div>
              <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
              <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
              <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
            </div>
            <button className="w-full py-5 rounded-full bg-gray-200"></button>
          </div>
        ))}
    </>
  );
};
const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col max-w-xs h-fit gap-2 bg-white cursor-pointer p-3 rounded-xl">
      <img
        src={product.image || placeholder}
        alt={product.name || "Placeholder"}
        className="w-full h-auto object-cover rounded-lg"
      />
      <div className="flex flex-col justify-between">
        <div className="flex w-full gap-2 items-center justify-between">
          <h2 className="text-dark font-bold text-lg">{product.name}</h2>
          <h3 className="whitespace-nowrap text-accent font-semibold text-md">
            {product.basePrice.toLocaleString("id-ID")}
          </h3>
        </div>
        <p className="text-gray-500 max-w-full line-clamp-3">
          {product.description || product.name}
        </p>
      </div>
      <Button
        buttonType="primary"
        buttonSize="medium"
        icon={LucideIcons.Pencil}
      >
        Edit
      </Button>
    </div>
  );
};

const AddMenuForm = ({ ingredients }) => {
  const [ingredientList, setIngredientList] = useState([
    { id: Date.now(), selectedId: "" },
  ]);

  const handleAddIngredientClick = () => {
    setIngredientList((prev) => [...prev, { id: Date.now(), selectedId: "" }]);
  };

  const handleRemoveIngredientClick = (id) => {
    setIngredientList((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleIngredientChange = (index, selectedId) => {
    console.log(`🔹 Selected Ingredient ID for index ${index}:`, selectedId);

    setIngredientList((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, selectedId } : ing))
    );
  };

  return (
    <form className="flex flex-col md:flex-row gap-3">
      {/* Menu Detail */}
      <div className="w-full flex flex-col gap-3">
        <Input
          type="text"
          label="Product Name"
          placeholder="e.g. Burnt Toast"
        />
        <Input
          type="number"
          min="5000"
          label="Base Price"
          placeholder="e.g. 20.000,-"
        />
        <Input
          inputType="dropdown"
          label="Status"
          options={[
            { value: "Available", label: "Available" },
            { value: "Not Available", label: "Not Available" },
          ]}
        />
        <Input
          type="number"
          min="1"
          max="100"
          label="Initial Stock"
          placeholder="e.g. 200"
        />
        <Input
          inputType="textarea"
          label="Description"
          placeholder="e.g. Araara coffee beans blend"
        />
        <Input inputType="file" label="Product Image" />
        <Button buttonType="secondary" buttonSize="medium">
          Add as Draft
        </Button>
        <Button buttonType="primary" buttonSize="medium">
          Add
        </Button>
      </div>

      {/* Ingredients Section */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-row w-full justify-between items-center">
          <h2 className="text-lg text-dark font-semibold">Recipe</h2>
          <Button
            icon={LucideIcons.Plus}
            buttonSize="medium"
            buttonType="primary"
            onClick={handleAddIngredientClick}
          />
        </div>

        {ingredientList.map((ing, index) => {
          // 🛠️ Ensure `_id` is always a string for comparison
          const selectedIngredient = ingredients.find(
            (ingredient) => String(ingredient._id) === String(ing.selectedId)
          );

          console.log(
            `🔍 Selected Ingredient Object for index ${index}:`,
            selectedIngredient
          );
          console.log(`🔹 Ingredients List:`, ingredients);

          return (
            <div key={ing.id} className="flex flex-row items-end gap-3">
              {/* Ingredient Name */}
              <Input
                inputType="dropdown"
                label="Ingredient"
                options={ingredients.map((ingredient) => ({
                  value: String(ingredient._id), // Ensure it's a string
                  label: ingredient.name,
                }))}
                value={String(ing.selectedId)} // Ensure it's a string
                onChange={(e) => handleIngredientChange(index, e.target.value)}
              />

              {/* Ingredient Quantity */}
              <Input
                type="number"
                min="1"
                max="100"
                label="Quantity"
                placeholder="e.g. 200"
              />

              {/* Ingredient Unit */}
              <h2 className="text-gray-700">
                {selectedIngredient
                  ? selectedIngredient.unit
                  : "Select Ingredient"}
              </h2>

              {/* Delete Ingredient Button */}
              <button
                onClick={() => handleRemoveIngredientClick(ing.id)}
                className="text-gray-500 hover:text-red-400 cursor-pointer bg-transparent hover:bg-red-100 p-2 rounded-lg"
              >
                <LucideIcons.X />
              </button>
            </div>
          );
        })}
      </div>
    </form>
  );
};

const ProductTabContent = ({
  activeTab,
  ingredients,
  orders,
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
      <div className="flex flex-row h-fit gap-5 pb-5 items-center">
        <button
          className="w-fit rounded-lg bg-accent p-3 text-white hover:bg-accent-hover"
          onClick={() =>
            openModal("Add New Menu", <AddMenuForm ingredients={ingredients} />)
          }
        >
          <LucideIcons.Plus />
        </button>
        <h1 className="text-dark font-bold text-3xl">
          {activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}
        </h1>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        body={modalBody}
      />
      <div
        className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 overflow-y-auto scrollbar-hidden"
        onClick={handleProductClick}
      >
        {isLoadingProducts ? (
          <Skeleton count={4} />
        ) : (
          products.map((product) => (
            <div key={product._id} data-id={product._id}>
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
          <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </Modal>
      )}
    </div>
  );
};

export default ProductTabContent;
