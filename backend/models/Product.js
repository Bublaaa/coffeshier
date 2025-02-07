import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, require: true },
    status: { type: String, enum: ["Available", "Not Available"] },
    stockQuantity: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }, // Reference
    ingredients: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantityBySize: [
          {
            size: { type: String, enum: ["regular", "large"], required: true },
            quantity: { type: Number, required: true },
          },
        ],
      },
    ],
    recipe: {
      steps: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
