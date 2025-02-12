import { Order } from "../models/Order.js";
import { Ingredient } from "../models/Ingredient.js";
import { Product } from "../models/Product.js";
import convertQuantityByUnit from "../utils/convertQuantityByUnit.js";

export const createBuyMerchandiseOrder = async (req, res) => {};

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
    // Validate required fields
    if (
      !userId ||
      !status ||
      !products ||
      !payment ||
      !Array.isArray(products) ||
      products.length < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    await isStockAvailable(products);
    let totalAmount = 0;

    // Process each product: calculate subtotal and deduct product stock
    for (const product of products) {
      if (typeof product.quantity !== "number" || !product.quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      const selectedProduct = await Product.findById(product.productId);
      // Determine additional price based on size (if defined)
      const sizeInfo = selectedProduct.sizes.find(
        (s) => s.size === product.customization.size
      ) || { additionalPrice: 0 };

      product.subtotal = selectedProduct.basePrice + sizeInfo.additionalPrice;
      totalAmount += product.subtotal * product.quantity;
      selectedProduct.stockQuantity -= product.quantity;
      await selectedProduct.save();
    }

    // Create the new order
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
      for (const ingredient of selectedProduct.ingredients) {
        const matchingSize = ingredient.quantityBySize.find(
          (q) => q.size === product.customization.size
        );
        if (!matchingSize) {
          return res.status(404).json({
            success: false,
            message: "No matching size available for an ingredient",
          });
        }
        const usedQuantityPerProduct = matchingSize.quantity;
        const totalUsedQuantity = usedQuantityPerProduct * product.quantity;
        await addStockMovements(
          ingredient.ingredientId,
          "OUT",
          totalUsedQuantity,
          matchingSize.unit,
          "Selling Products",
          newOrder._id
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSellOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, status, products, payment } = req.body;

  try {
    // Fetch the order to update
    const selectedOrder = await Order.findById(id);
    if (!selectedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order details (except products)
    selectedOrder.userId = userId;
    selectedOrder.status = status;
    selectedOrder.payment = payment;

    // Delete all existing stock movements linked to this order
    await deleteStockMovementsByOrderId(id);

    // (Optional) Check stock availability before proceeding
    await isStockAvailable(products);
    let totalAmount = 0;

    // Process each product in the order
    for (const product of products) {
      // Fetch the full product details
      const selectedProduct = await Product.findById(product.productId);
      if (!selectedProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }
      const sizeInfo = selectedProduct.sizes.find(
        (s) => s.size === product.customization.size
      ) || { additionalPrice: 0 };

      product.subtotal = selectedProduct.basePrice + sizeInfo.additionalPrice;
      totalAmount += product.subtotal * product.quantity;
      selectedProduct.stockQuantity -= product.quantity;

      // Process each ingredient for the product
      for (const prodIngredient of selectedProduct.ingredients) {
        // Get the matching quantityBySize entry for the order's customization size
        const matchingSize = prodIngredient.quantityBySize.find(
          (q) => q.size === product.customization.size
        );
        if (!matchingSize) {
          return res.status(404).json({
            success: false,
            message: `No matching size available for ingredient ${prodIngredient.ingredientId}`,
          });
        }

        // Fetch the Ingredient document to ensure it exists
        const selectedIngredient = await Ingredient.findById(
          prodIngredient.ingredientId
        );
        if (!selectedIngredient) {
          return res.status(404).json({
            success: false,
            message: `Ingredient with ID ${prodIngredient.ingredientId} not found`,
          });
        }
        const totalUsedQuantity = matchingSize.quantity * product.quantity;

        // Record a stock movement of type "OUT" for this ingredient
        await addStockMovements(
          selectedIngredient._id,
          "OUT",
          totalUsedQuantity,
          matchingSize.unit, // Now passing the original unit since conversion happens in addStockMovements
          product.customization.source || "Sell Order",
          id
        );
      }
    }
    selectedOrder.products = products;
    selectedOrder.totalAmount = totalAmount;
    // Save the updated order
    await selectedOrder.save();

    return res.status(200).json({
      success: true,
      message: "Sell order updated successfully",
      order: selectedOrder,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

const isStockAvailable = async (products) => {
  for (const orderedProduct of products) {
    const orderSize = orderedProduct.customization.size;
    const selectedProduct = await Product.findById(orderedProduct.productId);
    if (!selectedProduct) {
      throw new Error("Product not found");
    }

    for (const ingredient of selectedProduct.ingredients) {
      const matchingSize = ingredient.quantityBySize.find(
        (q) => q.size === orderSize
      );

      if (!matchingSize) {
        throw new Error("No matching size available for ingredient");
      }

      const { quantity, unit } = matchingSize;
      const selectedIngredient = await Ingredient.findById(
        ingredient.ingredientId
      );

      if (!selectedIngredient) {
        throw new Error("Ingredient not found");
      }

      const convertedQuantity = convertQuantityByUnit(
        quantity,
        unit,
        selectedIngredient.unit
      ).quantity;

      const requiredQuantity = convertedQuantity * orderedProduct.quantity;

      if (requiredQuantity > selectedIngredient.stockQuantity) {
        throw new Error(
          `Ingredient ${selectedIngredient.name} is not sufficient`
        );
      }
    }
  }
  return true;
};
