import mongoose from "mongoose";

// Auto add created at & updated at with "{timestamps:true}"
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      default: "Blocks",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
