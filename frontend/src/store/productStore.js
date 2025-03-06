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

  handleError: (error) => {},

  fetchProducts: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      console.log("Fetching products...");
      const response = await axios.get(`${API_URL}product/all`);
      console.log("Products received:", response.data.products);

      const successMessage = "Success";
      set({
        products: [...response.data.products], // ✅ Ensure a new array is created
        isLoading: false,
        message: successMessage,
      });

      console.log("State updated. Showing toast...");
      toast.success(successMessage); // ✅ Ensure toast is called
    } catch (error) {
      console.log("Error fetching products:", error);

      const errorMessage =
        error.response?.data?.message || "Error fetching products";

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error(errorMessage);
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
