import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

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
      toast.success("Fetch categories successful");
      console.log(response.data.categories);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  addCategory: async (name, icon) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}category/add`, {
        name,
        icon,
      });
      set({ categories: response.data.categories, isLoading: false });
      toast.success("Success add new category");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  updateCategory: async (id, name, icon) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}category/update/${id}`, {
        name,
        icon,
      });
      set({ categories: response.data.categories, isLoading: false });
      toast.success("Success update category");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}category/delete/${id}`);
      set({ categories: response.data.categories, isLoading: false });
      toast.success("Success delete category");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching categories";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
}));
