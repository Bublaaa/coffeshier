import { Product } from "../models/Product.js";
import { Ingredient } from "../models/Ingredient.js";
import { Category } from "../models/Category.js";

// Get all available and not available products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    if (products.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get available product & conditional category
export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.body;
  try {
    let query = { status: "Available" };
    if (categoryId) {
      query.categoryId = categoryId;
    }

    const products = await Product.find(query);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No available products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Available products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get specific products
export const getProductDetails = async (req, res) => {
  let { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: false, message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully retrieve product details",
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      image,
      status,
      stockQuantity,
      categoryId,
      sizes,
      ingredients,
      recipe,
    } = req.body;

    if (
      !name ||
      !basePrice ||
      !image ||
      !stockQuantity ||
      !Array.isArray(sizes) ||
      sizes.length < 1
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const productAlreadyExist = await Product.findOne({ name: name });
    if (productAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Product already added" });
    }
    const selectedCategory = await Category.findById(categoryId);
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // If product have Ingredients
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        const ingredientExist = await Ingredient.findById(
          ingredient.ingredientId
        );
        if (!ingredientExist) {
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        }
      }
    }

    const newProduct = new Product({
      name,
      basePrice,
      image,
      status,
      stockQuantity,
      categoryId,
      sizes,
      ingredients,
      recipe,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      basePrice,
      image,
      status,
      stockQuantity,
      categoryId,
      sizes,
      ingredients,
      recipe,
    } = req.body;

    const productAlreadyExist = await Product.findById(id);
    if (!productAlreadyExist) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (
      !name ||
      !basePrice ||
      !image ||
      !stockQuantity ||
      !status ||
      !Array.isArray(sizes) ||
      sizes.length < 1
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const selectedCategory = await Category.findById(categoryId);
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // If product have Ingredients
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        if (
          !ingredient.ingredientId ||
          !Array.isArray(ingredient.quantityBySize) ||
          ingredient.quantityBySize.length === 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid ingredient format",
          });
        }

        // Validate each quantityBySize entry
        for (const sizeEntry of ingredient.quantityBySize) {
          if (!sizeEntry.size || typeof sizeEntry.quantity !== "number") {
            return res.status(400).json({
              success: false,
              message: "Invalid size format",
            });
          }
        }

        const ingredientExist = await Ingredient.findById(
          ingredient.ingredientId
        );
        if (!ingredientExist) {
          return res
            .status(404)
            .json({ success: false, message: "Ingredient not found" });
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name,
        basePrice: basePrice,
        image: image,
        status: status,
        stockQuantity: stockQuantity,
        categoryId: categoryId,
        sizes: sizes,
        ingredients: ingredients,
        recipe: recipe,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
