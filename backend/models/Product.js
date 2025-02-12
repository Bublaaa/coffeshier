import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    basePrice: { type: Number, required: true }, // Base price for regular size
    image: { type: String, require: true },
    status: { type: String, enum: ["Available", "Not Available"] },
    stockQuantity: { type: Number, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }, // Reference
    sizes: [
      {
        size: { type: String, required: true },
        additionalPrice: { type: Number, default: 0 }, // Extra charge for larger size
      },
    ],
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
            unit: {
              type: String,
              required: true,
              enum: ["kg", "gr", "mg", "li", "ml"],
            },
          },
        ],
      },
    ],
    recipe: {
      steps: [{ type: String }],
    },
    // toppings: [
    //   {
    //     toppingId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Topping",
    //       required: true,
    //     },
    //     additionalPrice: { type: Number, required: true }, // Extra charge for this topping
    //   },
    // ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
