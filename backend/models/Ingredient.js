import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Optional link to product
    stockMovements: [
      {
        type: { type: String, enum: ["IN", "OUT"], required: true },
        quantity: { type: Number, required: true },
        source: { type: String }, // Supplier or Order
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

export const Ingredient = mongoose.model("Ingredient", IngredientSchema);
