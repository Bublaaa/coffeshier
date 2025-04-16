import { useReducer, useState } from "react";
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

const AddMerchandiseForm = ({}) => {
  const { addNewMerchandise, fetchProducts } = useProductStore();
  const [merchandiseData, setMerchandiseData] = useState({
    name: "",
    basePrice: 0,
    categoryId: "",
    status: "Not Available",
    description: "",
    sizes: [{ size: "regular", additionalPrice: 0 }],
    image: null,
  });
  const validateForm = () => {
    if (!String(merchandiseData.name || "").trim())
      newErrors.name = "Name is required.";
    if (Number(merchandiseData.basePrice) < 5000) {
      newErrors.basePrice = "Base price can't lower than 5000";
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMerchandiseData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form className="flex flex-col md:flex-row gap-3" onSubmit={handleSubmit}>
      {/* Merchandise Detail */}
      <div className="flex flex-col w-full gap-2">
        <ImageInput
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
            value={merchandiseData.name}
            onChange={handleInputChange}
            // error={errors.name}
          />
          {/* <DropdownInput
              label="Category"
              name="categoryId"
              value={merchandiseData.categoryId}
              options={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
              onChange={handleInputChange}
              error={errors.categoryId}
            /> */}
        </div>
        <div className="w-full grid grid-cols-2 gap-5 items-center">
          <Input
            type="number"
            min="5000"
            label="Base Price"
            name="basePrice"
            value={merchandiseData.basePrice}
            onChange={handleInputChange}
            // error={errors.basePrice}
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

        <Button type="submit" buttonType="primary">
          Save
        </Button>
      </div>
    </form>
  );
};
export default AddMerchandiseForm;
