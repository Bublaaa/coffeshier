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

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, selectedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Delete related stock movements
    await deleteStockMovementsByOrderId(id);

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

export const createBuyMerchandiseOrder = async (req, res) => {};

export const createBuyOrder = async (req, res) => {
  try {
    const { userId, status, ingredients, payment } = req.body;
    // Check for userId
    if (
      !userId ||
      !status ||
      !payment ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let totalAmount = 0;
    // Check for empty ingredients
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
      await addStockMovements(
        ingredient.ingredientId,
        "IN",
        ingredient.quantity,
        ingredient.unit,
        ingredient.source,
        newOrder._id
      );
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
    // Update order details
    selectedOrder.userId = userId;
    selectedOrder.status = status;
    selectedOrder.payment = payment;

    // Process stock updates in parallel
    await deleteStockMovementsByOrderId(id);

    await Promise.all(
      ingredients.map((ingredient) =>
        addStockMovements(
          ingredient.ingredientId,
          "IN",
          ingredient.quantity,
          ingredient.unit,
          ingredient.source,
          id
        )
      )
    );
    selectedOrder.ingredients = ingredients;
    let totalAmount = 0;
    for (const ingredient of selectedOrder.ingredients) {
      totalAmount += ingredient.subtotal;
    }
    selectedOrder.totalAmount = totalAmount;
    await selectedOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: selectedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSellOrder = async (req, res) => {
  const { userId, status, products, payment } = req.body;
  try {
    if (
      !userId ||
      !status ||
      !products ||
      !payment ||
      !Array.isArray(products) ||
      products.length < 1
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let totalAmount = 0;

    for (const product of products) {
      // Fetch the product details
      const selectedProduct = await Product.findById(product.productId);
      if (!selectedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Change the product subtotal = base price + additional price by size
      const additionalPrice = (
        selectedProduct.sizes.find(
          (s) => s.size === product.customization.size
        ) || {
          additionalPrice: 0,
        }
      ).additionalPrice;
      product.subtotal = selectedProduct.basePrice + additionalPrice;

      if (typeof product.quantity !== "number" || !product.quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid product quantity" });
      }

      // Add to total amount
      totalAmount += product.subtotal * product.quantity;

      // Deduct stock from the product inventory
      selectedProduct.stockQuantity -= product.quantity;
      await selectedProduct.save();
    }

    // Create new order
    const newOrder = new Order({
      userId,
      totalAmount,
      status: status || "pending",
      products,
      payment,
    });

    await newOrder.save();

    for (const product of products) {
      const selectedProduct = await Product.findById(product.productId);
      if (!selectedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      for (let ingredient of selectedProduct.ingredients) {
        const selectedIngredient = await Ingredient.findById(
          ingredient.ingredientId
        );

        if (!selectedIngredient) {
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        }

        const matchingSize = ingredient.quantityBySize.find(
          (q) => q.size === product.customization.size
        );

        if (!matchingSize) {
          return res
            .status(404)
            .json({ success: false, message: "No matching size available" });
        }

        const { quantity, unit } = matchingSize;

        // Convert quantity
        let convertedQuantity = convertQuantityByUnit(
          quantity,
          unit,
          selectedIngredient.unit
        ).quantity;

        selectedIngredient.stockMovements.push({
          type: "OUT",
          quantity: convertedQuantity * product.quantity,
          source: "Selling Products",
          orderId: newOrder._id,
        });
        await selectedIngredient.save();
        selectedIngredient.stockQuantity = calculateStockQuantity(
          selectedIngredient.stockMovements
        );
        await selectedIngredient.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSellOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, status, products, payment } = req.body;
  try {
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    selectedOrder.userId = userId;
    selectedOrder.status = status;
    selectedOrder.payment = payment;
    selectedOrder.products = products;

    for (let product of products) {
      const selectedProduct = await Product.findById(product.productId);
      for (const ingredient in selectedProduct.ingredients) {
        const selectedIngredient = await Ingredient.findById(
          ingredient.ingredientId
        );
        const matchingSize = ingredient.quantityBySize.find(
          (q) => q.size === product.customization.size
        );
        if (!matchingSize) {
          return res
            .status(404)
            .json({ success: false, message: "No matching size available" });
        }

        const { quantity, unit } = matchingSize;

        // Convert quantity
        let convertedQuantity = convertQuantityByUnit(
          quantity,
          unit,
          selectedIngredient.unit
        ).quantity;

        const matchingStock = selectedIngredient.stockMovements.find(
          (stock) => stock.orderId === id
        );
        if (!matchingStock) {
          return res.status(404).json({
            success: false,
            message: "No matching stock movement available",
          });
        }
        matchingStock.quantity = convertedQuantity;
        await matchingStock.save();
        selectedIngredient.stockQuantity = calculateStockQuantity(
          selectedIngredient.stockMovements
        );
        await selectedIngredient.save();
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const calculateStockQuantity = (stockMovements) => {
  const newStockQuantity = stockMovements.reduce((total, movement) => {
    return movement.type === "IN"
      ? total + movement.quantity
      : total - movement.quantity;
  }, 0);

  if (newStockQuantity < 0) {
    throw new Error("Stock quantity is not available");
  }

  return newStockQuantity;
};

const addStockMovements = async (
  ingredientId,
  type,
  quantity,
  unit,
  source,
  orderId
) => {
  const selectedIngredient = await Ingredient.findById(ingredientId);
  if (!selectedIngredient) {
    throw new Error(`Ingredient with ID ${ingredientId} not found`);
  }

  const convertedQuantity = convertQuantityByUnit(
    quantity,
    unit,
    selectedIngredient.unit
  ).quantity;

  selectedIngredient.stockMovements.push({
    type,
    quantity: convertedQuantity,
    source,
    orderId,
  });

  // Update stock quantity
  selectedIngredient.stockQuantity = calculateStockQuantity(
    selectedIngredient.stockMovements
  );

  await selectedIngredient.save();
};

const deleteStockMovementsByOrderId = async (orderId) => {
  // Remove stock movements from all ingredients with this orderId
  const result = await Ingredient.updateMany(
    { "stockMovements.orderId": orderId },
    { $pull: { stockMovements: { orderId: orderId } } }
  );

  if (result.modifiedCount === 0) {
    throw new Error(`No stock movements found for orderId: ${orderId}`);
  }
  const ingredients = await Ingredient.find();

  for (const ingredient of ingredients) {
    ingredient.stockQuantity = calculateStockQuantity(
      ingredient.stockMovements
    );
    await ingredient.save(); // Save the updated stock quantity
  }
};
