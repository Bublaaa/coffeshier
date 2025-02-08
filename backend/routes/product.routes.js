import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductDetails,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();
router.get("/all", getAllProducts);
router.get("/category", getProductsByCategory);
router.get("/detail", getProductDetails);

router.post("/add", addProduct); // Create a product
router.put("/update/:id", updateProduct); // Update a product by ID
router.delete("/delete/:id", deleteProduct); // Delete a product by ID

export default router;
