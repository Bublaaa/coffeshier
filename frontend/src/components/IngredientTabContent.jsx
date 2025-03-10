import { useState, Suspense, lazy, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Button from "./Button.jsx";
import { Input, DropdownInput } from "./Input";
import { formatDate } from "../utils/date";
import { motion } from "framer-motion";
import Modal from "./Modal.jsx";
import { useIngredientStore } from "../store/ingredientStore.js";
import toast from "react-hot-toast";
const StockMovement = lazy(() => import("./StockMovement.jsx"));

const Skeleton = ({ count }) => (
  <div className="animate-[pulse_0.8s_ease-in-out_infinite] flex gap-5 flex-col">
    <div className="grid grid-cols-3 gap-5">
      <div className="bg-gray-300 py-6 rounded-lg"></div>
      <div className="bg-gray-300 py-6 rounded-lg"></div>
      <div className="bg-gray-300 py-6 rounded-lg"></div>
    </div>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="w-full bg-gray-300 py-7 rounded-lg"></div>
    ))}
  </div>
);

const DeleteIngredientForm = ({ ingredient, onClose }) => {
  const { deleteIngredient, fetchIngredients } = useIngredientStore();
  const [confirmationText, setConfirmationText] = useState("");

  const handleDeleteIngredient = async (ingredientId) => {
    await deleteIngredient(ingredientId);
    fetchIngredients();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfirmationText(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmationText != ingredient.name) {
      toast.error("Confirmation is incorrect");
      return;
    }
    handleDeleteIngredient(ingredient._id);
    onClose();
  };
  return (
    <form
      className="flex flex-col gap-3 overflow-y-auto p-2 scrollbar-hidden"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-3">
        <p>
          Please retype <span className="font-semibold">{ingredient.name}</span>{" "}
          to continue deletion.
        </p>
        <Input
          type="text"
          label="Confirmation"
          name="confirmation"
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" buttonType="danger" buttonSize="large">
        Confirm
        <LucideIcons.Trash2Icon />
      </Button>
    </form>
  );
};

const AddIngredientForm = ({ onClose }) => {
  const { addNewIngredient, fetchIngredients } = useIngredientStore();
  const handleAddIngredient = async (name, unit) => {
    await addNewIngredient(name, unit);
    fetchIngredients();
  };
  const [ingredientData, setIngredientData] = useState({
    name: "",
    unit: "",
  });
  const handleSubmit = (e) => {
    if (!ingredientData.name || !ingredientData.unit) {
      e.preventDefault();
      toast.error("Ingredient name and unit are required.");
      return;
    }
    handleAddIngredient(ingredientData.name, ingredientData.unit);
    onClose();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngredientData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <form
      className="flex flex-col md:flex-row gap-3 overflow-y-auto p-2 scrollbar-hidden"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-3 pb-5">
        <Input
          type="text"
          placeholder="e.g. Tear Drop"
          label="Ingredient Name"
          name="name"
          onChange={handleInputChange}
        />
        <DropdownInput
          label="Unit"
          name="unit"
          options={[
            { value: "ml", label: "Milliliter" },
            { value: "li", label: "Liter" },
            { value: "kg", label: "Kilogram" },
            { value: "gr", label: "Gram" },
            { value: "mg", label: "Milligram" },
          ]}
          onChange={handleInputChange}
        />
      </div>
      <Button
        className="h-fit mt-auto mb-5"
        type="submit"
        buttonType="primary"
        buttonSize="large"
        icon={LucideIcons.Plus}
      >
        Add
      </Button>
    </form>
  );
};

const EditIngredientForm = ({ ingredient, onClose }) => {
  const { updateIngredient, fetchIngredients } = useIngredientStore();
  const [ingredientData, setIngredientData] = useState({
    id: "",
    name: "",
    unit: "",
  });
  useEffect(() => {
    if (ingredient) {
      setIngredientData({
        id: ingredient.id || "",
        name: ingredient.name || "",
        unit: ingredient.unit || "",
      });
    }
  }, []);

  const handleEditIngredient = async (ingredientId, name, unit) => {
    await updateIngredient(ingredientId, name, unit);
    fetchIngredients();
  };

  const handleSubmit = (e) => {
    if (!ingredientData.id || !ingredientData.name || !ingredientData.unit) {
      e.preventDefault();
      toast.error("All fields are required");
    }
    handleEditIngredient(
      ingredientData.id,
      ingredientData.name,
      ingredientData.unit
    );
    onClose();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngredientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(ingredientData);
  };
  return (
    <form
      className="flex flex-col md:flex-row gap-3 overflow-y-auto p-2 scrollbar-hidden"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-3 pb-5">
        <Input
          type="text"
          placeholder="e.g. Tear Drop"
          label="Ingredient Name"
          value={ingredientData.name}
          name="name"
          onChange={handleInputChange}
        />
        <DropdownInput
          label="Unit"
          name="unit"
          value={ingredientData.unit}
          options={[
            { value: "ml", label: "Milliliter" },
            { value: "li", label: "Liter" },
            { value: "kg", label: "Kilogram" },
            { value: "gr", label: "Gram" },
            { value: "mg", label: "Milligram" },
          ]}
          onChange={handleInputChange}
        />
      </div>
      <Button
        className="h-fit mt-auto mb-5"
        type="submit"
        buttonType="primary"
        buttonSize="large"
      >
        Save
        <LucideIcons.Save />
      </Button>
    </form>
  );
};

const IngredientTabContent = ({
  ingredients = [],
  orders,
  isLoadingIngredients,
  isLoadingProducts,
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  handleSearch,
}) => {
  const [collapsedRows, setCollapsedRows] = useState({});
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title, body) => {
    setModalBody(body);
    setModalTitle(title);
    setModalOpen(true);
  };

  const toggleCollapse = (id) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleIngredientActions = (e) => {
    const deleteButton = e.target.closest(".delete-ingredient-btn");
    const editButton = e.target.closest(".edit-ingredient-btn");
    if (deleteButton) {
      const ingredientId = deleteButton.dataset.id;
      const ingredientName = deleteButton.dataset.name;

      openModal(
        "Delete Ingredient",
        <DeleteIngredientForm
          ingredient={{ _id: ingredientId, name: ingredientName }}
          onClose={() => setModalOpen(false)}
        />
      );
    }
    if (editButton) {
      const ingredientId = editButton.dataset.id;
      const ingredientName = editButton.dataset.name;
      const ingredientUnit = editButton.dataset.unit;
      openModal(
        "Update Ingredient",
        <EditIngredientForm
          ingredient={{
            id: ingredientId,
            name: ingredientName,
            unit: ingredientUnit,
          }}
          onClose={() => setModalOpen(false)}
        />
      );
    }
  };

  if (isLoadingIngredients || isLoadingProducts) {
    return <Skeleton count={ingredients.length + 1 || 5} />;
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between gap-2 items-center p-1 pb-2 md:pb-5">
        {/* Add Ingredient Button */}
        <Button
          className="mx-1 text-start"
          buttonType="primary"
          buttonSize="icon"
          icon={LucideIcons.Plus}
          onClick={() =>
            openModal(
              "Add New Ingredient",
              <AddIngredientForm onClose={() => setModalOpen(false)} />
            )
          }
        >
          <p className="hidden md:block text-white p-1">Add Ingredient</p>
        </Button>
        {/* Pagination Controls */}
        <div className="flex justify-center md:gap-5 gap-2 items-center">
          <Button
            buttonType={currentPage === 1 ? "disabled" : "secondary"}
            buttonSize="icon"
            onClick={handlePrevPage}
            icon={LucideIcons.ChevronLeft}
          ></Button>
          <p>
            {currentPage}/{totalPages}
          </p>
          <Button
            buttonType={currentPage === totalPages ? "disabled" : "secondary"}
            buttonSize="icon"
            onClick={handleNextPage}
            icon={LucideIcons.ChevronRight}
          ></Button>
        </div>
        {/* Search Ingredient */}
        <div className="flex flex-row gap-2 items-center">
          <Input
            className="w-fit"
            type="text"
            placeholder="Search by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch({ searchQuery: searchText });
              }
            }}
          />
          <Button
            buttonSize="icon"
            buttonType="primary"
            onClick={() => handleSearch({ searchQuery: searchText })}
          >
            <LucideIcons.Search />
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        body={modalBody}
      />
      <div className="w-full overflow-x-auto overflow-y-auto scrollbar-hidden">
        {/* Table Header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{ duration: 0.5 }}
          className="transition-all ease-in-out grid md:grid-cols-5 grid-cols-4 w-full bg-accent items-center font-semibold p-4 rounded-lg justify-between "
        >
          <div className="w-full">
            <p className="text-white">Ingredient Name</p>
          </div>
          <div className="">
            <p className="text-white">Quantity</p>
          </div>
          <div className="hidden md:block">
            <p className="text-white">Last Order</p>
          </div>
        </motion.div>

        {/* Ingredient Rows */}
        <div
          className="w-full space-y-2 mt-2"
          onClick={(e) => handleIngredientActions(e)}
        >
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => {
              const isCollapsed = collapsedRows[ingredient._id] || false;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: index / 4 }}
                  key={ingredient._id}
                  className="bg-white rounded-lg"
                >
                  {/* Ingredient Row */}
                  <div
                    className="grid grid-cols-4 md:grid-cols-5 gap-4 w-full px-4 py-3 hover:bg-gray-100 rounded-lg hover:border border-accent hover:border-2 transition cursor-pointer items-center"
                    onClick={() => toggleCollapse(ingredient._id)}
                  >
                    <p className="truncate">
                      {ingredient.name.replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      )}
                    </p>
                    <p className="text-gray-600  font-semibold">
                      {ingredient.stockQuantity} {ingredient.unit}
                    </p>
                    <p className="text-gray-500 hidden md:block">
                      {formatDate(ingredient.updatedAt)}
                    </p>
                    <div className="flex flex-row md:gap-5 gap-2 items-center">
                      <Button
                        buttonType="secondary"
                        buttonSize="icon"
                        className="edit-ingredient-btn"
                        data-id={ingredient._id}
                        data-name={ingredient.name}
                        data-unit={ingredient.unit}
                      >
                        <LucideIcons.Pen className="size-5" />
                      </Button>
                      <Button
                        buttonType="danger"
                        buttonSize="icon"
                        className="delete-ingredient-btn"
                        data-id={ingredient._id}
                        data-name={ingredient.name}
                      >
                        <LucideIcons.Trash className="size-5" />
                      </Button>
                    </div>
                    <LucideIcons.ChevronRight
                      className={`ml-auto transition-transform duration-300 ${
                        isCollapsed ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {/* Stock Movements Row */}
                  {isCollapsed && (
                    <Suspense
                      fallback={
                        <p className="text-center py-2">
                          Loading stock movements...
                        </p>
                      }
                    >
                      <StockMovement ingredient={ingredient} orders={orders} />
                    </Suspense>
                  )}
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-5">
              No ingredients found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientTabContent;
