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
  "Gift",
].map((icon) => ({ icon, value: icon }));

const Skeleton = ({ count }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="animate-pulse bg-gray-200 flex items-center gap-5 h-fit py-6 px-8 rounded-lg"
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
    e.preventDefault();

    // Validation
    if (confirmationText !== category.name) {
      let newErrors = { confirmation: "Confirmation does not match" };
      setError(newErrors);
      toast.error("Confirmation does not match");
      return;
    }

    onClose();
    await deleteCategory(category.id);
    fetchCategories();
  };

  return (
    <form
      className="flex flex-col gap-3 overflow-y-auto p-2 scrollbar-hidden"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-3">
        <p className="select-none">
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
      ? await updateCategory(category.id, categoryData.name, categoryData.icon)
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
    // Check if delete button is clicked
    const deleteButton = e.target.closest(".delete-category-btn");
    if (deleteButton) {
      openModal(
        "Delete Category",
        <DeleteCategoryForm
          category={{
            id: deleteButton.dataset.id,
            name: deleteButton.dataset.name,
            icon: deleteButton.dataset.icon,
          }}
          onClose={closeModal}
        />
      );
      return; // Stop execution to prevent edit from triggering
    }

    // Check if edit button is clicked (only if delete was not clicked)
    const editButton = e.target.closest(".edit-category-btn");
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.1, ease: "easeInOut" },
                }}
                key={category._id}
                className="flex md:flex-row items-center md:gap-5 gap-2 md:py-4 py-3 md:px-5 px-4 rounded-lg bg-white cursor-pointer hover:bg-gray-50 hover:scale-101 hover:border-2 border-accent edit-category-btn"
                data-id={category._id}
                data-name={category.name}
                data-icon={category.icon}
              >
                <IconComponent className="size-7" />
                <p className="text-dark font-bold">
                  {category.name.replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
                <Button
                  buttonType="danger"
                  buttonSize="icon"
                  className="delete-category-btn ml-auto z-10"
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
