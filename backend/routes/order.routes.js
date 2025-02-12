import express from "express";
import {
  getAllOrder,
  createBuyOrder,
  createSellOrder,
  deleteOrder,
  updateBuyOrder,
  updateSellOrder,
  getOrderById,
} from "../controllers/order.controller.js";

const router = express.Router();
router.get("/all", getAllOrder);
router.get("/get/:id", getOrderById);

router.post("/buy", createBuyOrder);
router.put("/update-buy/:id", updateBuyOrder);
router.put("/update-sell/:id", updateSellOrder);

router.delete("/delete/:id", deleteOrder);

router.post("/sell", createSellOrder);

// router.get("/detail/:id", getProductDetails);
// router.post("/add", addProduct); // Create a product
// router.put("/update/:id", updateProduct); // Update a product by ID
// router.delete("/delete/:id", deleteProduct); // Delete a product by ID

export default router;
