import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useIngredientStore = create((set) => ({
  ingredients: [],
  error: null,
  isLoading: false,
  message: null,

  totalPages: 0,
  currentPage: 1,
  totalItems: 0,

  fetchIngredients: async (page = 1, searchQuery = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}ingredient/get`, {
        params: { page, limit: 8, search: searchQuery },
      });

      set({
        ingredients: response.data.ingredients,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
        isLoading: false,
        message: "Success fetch ingredients",
      });
      // toast.success("Success fetch ingredients");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching ingredients",
        isLoading: false,
      });
    }
  },

  addNewIngredient: async (name, unit) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}ingredient/add`, {
        name,
        unit,
      });
      const successMessage = "Success add new ingredient";
      set({
        ingredients: response.data.ingredient,
        isLoading: false,
        message: successMessage,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding new ingredients";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  updateIngredient: async (ingredientId, name, unit) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.put(
        `${API_URL}ingredient/update/${ingredientId}`,
        {
          name,
          unit,
        }
      );
      const successMessage = "Ingredient updated successfully";
      set({
        ingredients: response.data.ingredient,
        isLoading: false,
        message: successMessage,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding new ingredients";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  deleteIngredient: async (ingredientId) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.delete(
        `${API_URL}ingredient/delete/${ingredientId}`
      );
      const successMessage = "Success delete ingredient";
      set({
        isLoading: false,
        message: response.data.message,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error delete ingredient";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
}));
