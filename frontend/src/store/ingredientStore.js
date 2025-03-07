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

  fetchIngredients: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.get(`${API_URL}ingredient/get`);
      const successMessage = "Success fetch ingredients";
      set({
        ingredients: response.data.ingredients,
        isLoading: false,
        message: successMessage,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching ingredients";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  addNewIngredient: async (name, unit) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}ingredient/add`, {
        name,
        unit,
      });
      set({ ingredients: response.data.ingredient, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching ingredients";
      set({
        error: errorMessage || "Error fetching ingredients",
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
}));
