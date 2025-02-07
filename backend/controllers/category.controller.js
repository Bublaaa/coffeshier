import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
        categories: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get all categories",
      categories: categories,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const addNewCategory = async (req, res) => {
  let { name, icon } = req.body;
  name = name.toLowerCase();
  try {
    const categoryAlreadyExist = await Category.findOne({ name });
    if (categoryAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exist" });
    }
    const newCategory = new Category({ name: name, icon });
    await newCategory.save();
    res.status(200).json({
      success: true,
      message: "Category added successfully",
      category: {
        ...newCategory._doc,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name.toLowerCase(), icon },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update category" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params; // Extract 'id' properly
  try {
    const categoryExist = await Category.findById(id);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      // Fix: It should be `> 0` instead of `> 1`
      return res.status(400).json({
        success: false,
        message: "Can't delete category with products in it",
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
