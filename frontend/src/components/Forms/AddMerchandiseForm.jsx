import { useReducer, useState, useEffect } from "react";
import {
  Input,
  TextareaInput,
  DropdownInput,
  CheckboxInput,
  ImageInput,
} from "../Input";
import * as LucideIcons from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button";
import { useProductStore } from "../../store/productStore";

const AddMerchandiseForm = ({ categories, onChangeTab, onClose }) => {
  const merchandiseCategory = categories.find(
    (category) => category.name.toLowerCase() === "merchandise"
  );
  useEffect(() => {
    if (merchandiseCategory) {
      setMerchandiseData((prev) => ({
        ...prev,
        categoryId: merchandiseCategory._id,
      }));
    }
  }, [merchandiseCategory]);
  const { addNewMerchandise, fetchProducts } = useProductStore();
  const [errors, setErrors] = useState({});
  const [merchandiseData, setMerchandiseData] = useState({
    name: "",
    basePrice: 0,
    categoryId: "",
    status: "Not Available",
    stockQuantity: 0,
    description: "",
    image: null,
    sizes: [],
    ingredients: [],
    recipe: "",
  });
  const validateForm = () => {
    let newErrors = {};
    if (!String(merchandiseData.name || "").trim())
      newErrors.name = "Name is required.";
    if (Number(merchandiseData.basePrice) < 5000) {
      newErrors.basePrice = "Base price can't lower than 5000";
    }
    if (!String(merchandiseData.categoryId || "").trim()) {
      newErrors.categoryId = "Category is required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMerchandiseData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddMerchandise = async (merchandiseData) => {
    await addNewMerchandise(merchandiseData);
    fetchProducts();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddMerchandise(merchandiseData);
      onClose();
    }
  };
  const handleRedirect = () => {
    onChangeTab();
    onClose();
  };
  return (
    <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
      {/* Merchandise Detail */}
      <div className="flex flex-col w-full gap-2">
        <ImageInput
          label="Product Image"
          onFileChange={(file) => console.log("Uploaded File:", file)}
        />
        <div
          className={`items-center ${
            merchandiseCategory ? "grid grid-cols-1" : "grid grid-cols-2 gap-5"
          }`}
        >
          <Input
            className="w-full"
            type="text"
            placeholder="e.g. Burnt Toast"
            label="Product Name"
            name="name"
            value={merchandiseData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          {!merchandiseCategory && (
            <div className="text-red-600 text-sm w-full">
              Category <span className="font-bold">merchandise</span> not found.{" "}
              <a
                className="text-blue-600 underline cursor-pointer"
                onClick={() => onChangeTab && handleRedirect()}
              >
                Go to Category Tab
              </a>
            </div>
          )}
        </div>
        <div className="w-full grid grid-cols-2 gap-5 items-center">
          <Input
            type="number"
            min="5000"
            label="Base Price"
            name="basePrice"
            value={merchandiseData.basePrice}
            onChange={handleInputChange}
            error={errors.basePrice}
            placeholder="e.g. 10.000"
          />
          <DropdownInput
            label="Status"
            name="status"
            value={merchandiseData.status}
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
          value={merchandiseData.description}
          onChange={handleInputChange}
        />
        {errors.categoryId && (
          <p className="text-red-500 text-sm">{errors.categoryId}</p>
        )}
        <Button type="submit" buttonType="primary">
          Save
        </Button>
      </div>
    </form>
  );
};
export default AddMerchandiseForm;
