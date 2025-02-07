import express from "express";
import {
  getAllCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/get-category", getAllCategories);
router.post("/add-category", addNewCategory);
router.put("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);

export default router;
