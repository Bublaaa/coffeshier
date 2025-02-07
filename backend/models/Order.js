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
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Reference
        customization: {
          // NEW: Future-proof for custom orders
          size: {
            type: String,
            enum: ["regular", "large"],
            default: "regular",
          },
          note: { type: String },
        },
        quantity: { type: Number, required: true },
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
