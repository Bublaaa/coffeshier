import express from "express";
import {
  getAllCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/get", getAllCategories);
router.post("/add", addNewCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
