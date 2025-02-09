import { Ingredient } from "../models/Ingredient.js";
import { Order } from "../models/Order.js";
import convertQuantityByUnit from "../utils/convertQuantityByUnit.js";

// Add new ingredient with 0 stock quantity & without stock movement
export const addNewIngredient = async (req, res) => {
  const { name, unit } = req.body;
  try {
    if (!name || !unit || name.trim() === "" || unit.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Name and Unit can't be empty!" });
    }

    const ingredientAlreadyExist = await Ingredient.findOne({
      name: name.toLowerCase(),
    });

    if (ingredientAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Ingredient is already added" });
    }

    const newIngredient = new Ingredient({
      name: name.toLowerCase(),
      unit: unit.toLowerCase(),
      stockQuantity: 0,
      stockMovements: [],
    });

    await newIngredient.save();

    return res.status(201).json({
      success: true,
      message: "Ingredient added successfully",
      ingredient: newIngredient,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update ingredient data
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name and Unit are required",
      });
    }

    // Fetch current ingredient
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    let convertedStockQuantity = 0;

    // Convert stock movements safely
    for (let stockMovement of ingredient.stockMovements) {
      const conversion = convertQuantityByUnit(
        stockMovement.quantity,
        ingredient.unit,
        unit
      );

      stockMovement.quantity = conversion.quantity;
      convertedStockQuantity += stockMovement.quantity;
    }

    // Update ingredient
    ingredient.name = name.toLowerCase();
    ingredient.unit = unit;
    ingredient.stockQuantity = convertedStockQuantity;

    await ingredient.save();

    return res.status(200).json({
      success: true,
      message: "Ingredient updated successfully",
      ingredient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Delete ingredient
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIngredient = await Ingredient.findByIdAndDelete(id);

    if (!deletedIngredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ createdAt: -1 });
    if (ingredients.length < 1) {
      res.status(404).json({ success: false, message: "No Ingredients exist" });
    }
    res.status(200).json({ success: true, ingredients });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findById(id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieve ingredient data",
      ingredient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const pruneStockDocs = async (req, res) => {
  try {
    // Fetch all ingredients
    const ingredients = await Ingredient.find();

    // Fetch all existing order IDs
    const existingOrders = new Set(
      (await Order.find({}, "_id")).map((order) => order._id.toString())
    );

    for (const ingredient of ingredients) {
      let totalPrunedQuantity = 0;

      // Filter out stock movements that reference non-existing orders
      const validStockMovements = ingredient.stockMovements.filter(
        (movement) => {
          if (!movement.orderId) return true; // Keep if there's no orderId

          const exists = existingOrders.has(movement.orderId.toString());
          if (!exists) {
            totalPrunedQuantity += movement.quantity; // Deduct from stock
          }
          return exists; // Keep only valid movements
        }
      );

      // Deduct stock quantity based on pruned stock movements
      ingredient.stockQuantity = Math.max(
        0,
        ingredient.stockQuantity - totalPrunedQuantity
      );
      ingredient.stockMovements = validStockMovements;

      // Save updated ingredient document
      await ingredient.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Stock movements pruned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
