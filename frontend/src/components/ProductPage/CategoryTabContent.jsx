import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../Button";
import { useCategoryStore } from "../../store/categoryStore";
import { Input, RadioInput } from "../Input";
import * as LucideIcons from "lucide-react";
import Modal from "../Modal";
import toast from "react-hot-toast";

const iconOptions = [
  "Cookie",
  "Salad",
  "Wheat",
  "WheatOff",
  "CakeSlice",
  "Beef",
  "Candy",
  "Croissant",
  "Dessert",
  "Donut",
  "EggFried",
  "IceCreamBowl",
  "IceCreamCone",
  "Pizza",
  "Soup",
  "Coffee",
  "Milk",
  "GlassWater",
  "Sandwich",
].map((icon) => ({ icon, value: icon }));

const Skeleton = ({ count }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse bg-gray-200 flex items-center gap-5 h-fit py-6 px-8 rounded-lg shadow-md"
      >
        <div className="px-5 py-5 bg-gray-300 rounded-lg"></div>
      </div>
    ))}
  </>
);

const DeleteCategoryForm = ({ onClose, category }) => {
  const { deleteCategory, fetchCategories } = useCategoryStore();
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault(); // FIXED: Prevent default form submission

    // Validation
    if (confirmationText !== category.name) {
      let newErrors = { confirmation: "Confirmation does not match" };
      setError(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    await deleteCategory(category._id);
    fetchCategories();
    onClose();
  };

  return (
    <form
      className="flex flex-col gap-3 overflow-y-auto p-2 scrollbar-hidden"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-3">
        <p>
          Please retype <span className="font-semibold">{category.name}</span>{" "}
          to confirm deletion.
        </p>
        <Input
          type="text"
          label="Confirmation"
          name="confirmation"
          onChange={(e) => {
            setConfirmationText(e.target.value); // FIXED: Used e.target.value instead of undefined 'value'
          }}
          error={error.confirmation}
        />
      </div>
      <Button type="submit" buttonType="danger" buttonSize="large">
        Confirm
        <LucideIcons.Trash2Icon />
      </Button>
    </form>
  );
};

const CategoryForm = ({ category, onClose }) => {
  const [error, setError] = useState("");
  const { addCategory, updateCategory, fetchCategories } = useCategoryStore();
  const [categoryData, setCategoryData] = useState({
    name: category?.name || "",
    icon: category?.icon || "Cookie",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!categoryData.name) newErrors.name = "Name is required";
    if (!categoryData.icon) newErrors.icon = "Unit is required";
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    category
      ? await updateCategory(category._id, categoryData.name, categoryData.icon)
      : await addCategory(categoryData.name, categoryData.icon);

    fetchCategories();
    onClose();
  };

  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={handleSubmit}>
      <Input
        label="Category Name"
        name="name"
        value={categoryData.name}
        onChange={handleInputChange}
        error={error.name}
      />
      <RadioInput
        name="icon"
        initialValue={categoryData.icon}
        options={iconOptions}
        onChange={handleInputChange}
        error={error.icon}
      />
      <Button type="submit" className="ml-auto" buttonType="primary">
        {category ? "Update" : "Add"}
      </Button>
    </form>
  );
};

const CategoryTabContent = ({ activeTab, isLoadingCategory, categories }) => {
  const { fetchCategories } = useCategoryStore();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    body: null,
  });

  const openModal = (title, body) =>
    setModalState({ isOpen: true, title, body });
  const closeModal = () =>
    setModalState({ isOpen: false, title: "", body: null });

  const handleCategoryActions = (e) => {
    const deleteButton = e.target.closest(".delete-category-btn");
    const editButton = e.target.closest(".edit-category-btn");

    console.log("Delete button clicked:", deleteButton); // FIXED: Debugging log

    if (deleteButton) {
      openModal(
        "Delete Category",
        <DeleteCategoryForm
          category={{
            _id: deleteButton.dataset.id,
            name: deleteButton.dataset.name,
            icon: deleteButton.dataset.icon,
          }}
          onClose={closeModal} // FIXED: Used the correct closeModal function
        />
      );
    }
    if (editButton) {
      const category = {
        id: editButton.dataset.id,
        name: editButton.dataset.name,
        icon: editButton.dataset.icon,
      };
      openModal(
        "Update Category",
        <CategoryForm category={category} onClose={closeModal} />
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-5 pb-5">
        <Button
          buttonType="primary"
          buttonSize="icon"
          onClick={() =>
            openModal("Add Category", <CategoryForm onClose={closeModal} />)
          }
        >
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        body={modalState.body}
      />

      <div
        className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-5 p-2"
        onClick={(e) => handleCategoryActions(e)}
      >
        {isLoadingCategory ? (
          <Skeleton count={5} />
        ) : (
          categories?.map((category) => {
            const IconComponent =
              LucideIcons[category.icon] || LucideIcons.GlassWater;
            return (
              <motion.div
                key={category._id}
                className="flex md:flex-row items-center md:gap-5 gap-2 md:py-4 py-3 md:px-5 px-4 rounded-lg bg-white shadow-md cursor-pointer hover:bg-gray-50 hover:scale-105 edit-category-btn"
                data-id={category._id}
                data-name={category.name}
                data-icon={category.icon}
              >
                <IconComponent className="size-7" />
                <p className="text-dark font-bold">{category.name}</p>
                <Button
                  buttonType="danger"
                  buttonSize="icon"
                  className="delete-category-btn ml-auto"
                  data-id={category._id}
                  data-name={category.name}
                  data-icon={category.icon}
                >
                  <LucideIcons.Trash className="size-5" />
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryTabContent;
