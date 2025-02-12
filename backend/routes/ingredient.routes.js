import express from "express";
import {
  addNewIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
  pruneStockDocs,
} from "../controllers/ingredient.controller.js";

const router = express.Router();
router.get("/get", getIngredients);
router.get("/get/:id", getIngredientById);
// Just record the added ingredient
router.post("/add", addNewIngredient);
router.put("/update/:id", updateIngredient);
router.delete("/delete/:id", deleteIngredient);

router.get("/clean", pruneStockDocs);

export default router;
