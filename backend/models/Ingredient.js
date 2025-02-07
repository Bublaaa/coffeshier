import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
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
