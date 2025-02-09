import { Order } from "../models/Order.js";
import { Ingredient } from "../models/Ingredient.js";
import { Product } from "../models/Product.js";
import convertQuantityByUnit from "../utils/convertQuantityByUnit.js";

export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders || orders.length < 1) {
      return res.status(404).json({ success: false, message: "No order yet" });
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully retrieve orders", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBuyOrder = async (req, res) => {
  try {
    const { userId, status, ingredients, payment } = req.body;

    // Check for userId
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User is not logged in" });
    }

    let totalAmount = 0;
    // Check for empty ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Ingredients are required" });
    }

    for (const ingredient of ingredients) {
      // Validate data types
      if (
        typeof ingredient.quantity !== "number" ||
        typeof ingredient.subtotal !== "number" ||
        typeof ingredient.unit !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ingredient format",
        });
      }
      // Validate empty quantity and subtotal
      if (!ingredient.quantity || !ingredient.unit || !ingredient.subtotal) {
        return res.status(400).json({
          success: false,
          message: "Quantity, Unit, and subtotal are required",
        });
      }

      // Check if ingredient exists
      const ingredientExist = await Ingredient.findById(
        ingredient.ingredientId
      );
      if (!ingredientExist) {
        return res
          .status(404)
          .json({ success: false, message: "Ingredient not found" });
      }

      // Update total amount
      totalAmount += ingredient.subtotal;
    }

    // Create new order
    const newOrder = new Order({
      userId: userId,
      totalAmount: totalAmount,
      status: status || "pending",
      ingredients: ingredients,
      payment: payment,
    });

    await newOrder.save();

    for (const ingredient of ingredients) {
      const selectedIngredient = await Ingredient.findById(
        ingredient.ingredientId
      );

      if (!selectedIngredient) continue; // Skip if ingredient doesn't exist

      // Convert quantity based on ingredient's default unit
      const { quantity: convertedQty, unit: convertedUnit } =
        convertQuantityByUnit(
          ingredient.quantity,
          ingredient.unit,
          selectedIngredient.unit
        );

      // Add stock movement with converted quantity
      selectedIngredient.stockMovements.push({
        type: "IN",
        quantity: convertedQty,
        unit: convertedUnit,
        source: "Purchase Order",
        orderId: newOrder._id,
      });

      // Increase stock quantity with converted value
      selectedIngredient.stockQuantity += convertedQty;

      await selectedIngredient.save();
    }

    res.status(201).json({
      success: true,
      message: "Buy order created successfully",
      order: newOrder,
      ingredients,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuyOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, status, ingredients, payment } = req.body;

  try {
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order details (excluding ingredients)
    selectedOrder.userId = userId;
    selectedOrder.status = status;
    selectedOrder.payment = payment;
    selectedOrder.ingredients = ingredients;

    // Process each ingredient in the updated order
    for (let orderIngredient of selectedOrder.ingredients) {
      const stockIngredient = await Ingredient.findById(
        orderIngredient.ingredientId
      );
      if (!stockIngredient) {
        return res.status(404).json({
          success: false,
          message: `Ingredient with ID ${orderIngredient.ingredientId} not found`,
        });
      }

      let newQuantity = orderIngredient.quantity;
      let newUnit = orderIngredient.unit;

      // Convert unit if necessary
      if (newUnit !== stockIngredient.unit) {
        try {
          const conversion = convertQuantityByUnit(
            orderIngredient.quantity,
            newUnit,
            stockIngredient.unit
          );
          newQuantity = conversion.quantity;
          newUnit = stockIngredient.unit;
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: `Conversion error for ${orderIngredient.ingredientId}: ${error.message}`,
          });
        }
      }

      // Update order ingredient with the converted values
      orderIngredient.quantity = newQuantity;
      orderIngredient.unit = newUnit;

      // Find stock movement for this order
      const stockMovementIndex = stockIngredient.stockMovements.findIndex(
        (movement) =>
          movement.orderId.toString() === selectedOrder.id.toString()
      );

      if (stockMovementIndex !== -1) {
        // Update existing stock movement
        stockIngredient.stockMovements[stockMovementIndex].quantity =
          newQuantity;
        stockIngredient.stockMovements[stockMovementIndex].source =
          orderIngredient.source;
      } else {
        // If not found, add a new stock movement entry
        stockIngredient.stockMovements.push({
          type: "IN",
          orderId: selectedOrder.id,
          quantity: newQuantity,
          source: orderIngredient.source,
        });
      }
      stockIngredient.stockQuantity = 0;
      for (const stockMovement of stockIngredient.stockMovements) {
        stockIngredient.stockQuantity += stockMovement.quantity;
      }

      // Save the updated ingredient
      await stockIngredient.save();
    }

    // Save the updated order
    await selectedOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order and stock movements updated successfully",
      order: selectedOrder,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSellOrder = async (req, res) => {};

export const deleteBuyOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Iterate through each ingredient in the order
    for (const ingredient of selectedOrder.ingredients) {
      const ingredientDoc = await Ingredient.findById(ingredient.ingredientId);
      if (!ingredientDoc) {
        return res.status(404).json({
          success: false,
          message: "Ingredient not found",
          ingredient,
        });
      }

      // Remove stock movement related to this order
      ingredientDoc.stockMovements = ingredientDoc.stockMovements.filter(
        (movement) => movement.orderId.toString() !== selectedOrder.id
      );

      // Deduct stockQuantity (since this order was a "buy" order)
      ingredientDoc.stockQuantity -= ingredient.quantity;

      // Save updated ingredient
      await ingredientDoc.save();
    }

    // Delete the order after processing ingredients
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order and related stock movements deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
