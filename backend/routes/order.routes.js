import express from "express";
import {
  getAllOrder,
  createBuyOrder,
  createSellOrder,
  deleteBuyOrder,
} from "../controllers/order.controller.js";

const router = express.Router();
router.get("/all", getAllOrder);
router.post("/buy", createBuyOrder);
router.post("/sell", createSellOrder);

router.delete("/delete-buy/:id", deleteBuyOrder);

// router.get("/detail/:id", getProductDetails);
// router.post("/add", addProduct); // Create a product
// router.put("/update/:id", updateProduct); // Update a product by ID
// router.delete("/delete/:id", deleteProduct); // Delete a product by ID

export default router;
