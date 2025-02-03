import mongoose from "mongoose";

// Auto add created at & updated at with "{timestamps:true}"
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
