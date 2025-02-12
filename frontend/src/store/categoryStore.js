import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useCategoryStore = create((set) => ({
  categories: [],
  error: null,
  isLoading: false,
  message: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}category/get`);
      set({ categories: response.data.categories, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching categories",
        isLoading: false,
      });
    }
  },
}));
