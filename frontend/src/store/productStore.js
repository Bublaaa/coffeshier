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

  handleError: (error) => {
    const errorMessage = error.message || "Error fetching products";
    set({
      error: errorMessage || "Error fetching products",
      isLoading: false,
    });
    toast.error(errorMessage);
  },
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}product/all`);
      // console.log(response.data.products);
      set({ products: response.data.products || [], isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      handleError(error);
    }
  },
  fetchMerchandises: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}product/all`);
      const filteredProducts = response.data.products.filter(
        (product) =>
          Array.isArray(product.ingredients) && product.ingredients.length > 0
      );
      console.log(filteredProducts);

      set({ products: filteredProducts, isLoading: false });
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
