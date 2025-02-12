import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
  products: [],
  error: null,
  isLoading: false,
  message: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}product/all`);

      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching products";
      set({
        error: errorMessage || "Error fetching products",
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
  fetchProductsByCategory: async (categoryId) => {
    set({ isLoading: true, error: null, products: [] });

    try {
      const response = await axios.post(`${API_URL}product/category`, {
        categoryId,
      });

      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching products";

      set({ error: errorMessage, isLoading: false, products: [] });

      toast.error(errorMessage);
    }
  },
}));
