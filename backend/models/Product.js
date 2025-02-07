import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, require: true },
    stockQuantity: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }, // Reference
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    recipe: {
      steps: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
