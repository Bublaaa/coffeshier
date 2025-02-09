import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "canceled"],
      default: "pending",
    },
    // Ordered Products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        customization: {
          size: {
            type: String,
            enum: ["regular", "large"],
            default: "regular",
          },
          note: { type: String },
        },
      },
    ],

    // Purchased Ingredients
    ingredients: [
      {
        _id: false,
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: { type: Number, required: true },
        unit: {
          type: String,
          required: true,
          enum: ["kg", "gr", "mg", "li", "ml"],
        },
        subtotal: { type: Number, required: true },
      },
    ],
    payment: {
      method: {
        type: String,
        enum: ["cash", "card", "other"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      paidAt: { type: Date },
    },
  },
  { timestamps: true } //Auto add createdAt & updatedAt
);

export const Order = mongoose.model("Order", OrderSchema);
