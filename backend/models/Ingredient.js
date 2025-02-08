import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "gr", "mg", "li", "ml"],
    },
    stockMovements: [
      {
        type: { type: String, enum: ["IN", "OUT"], required: true },
        quantity: { type: Number, required: true },
        source: { type: String },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        timestamp: { type: Date, default: Date.now },
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

export const Ingredient = mongoose.model("Ingredient", IngredientSchema);
