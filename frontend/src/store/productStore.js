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
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.get(`${API_URL}product/all`);
      const successMessage = "Success fetch products";
      set({
        products: [...response.data.products],
        isLoading: false,
        message: successMessage,
      });

      toast.success(successMessage);
    } catch (error) {
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
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.get(`${API_URL}product/all`);
      const successMessage = "Success fetch merchandises";
      const merchandises = response.data.products.filter(
        (product) =>
          Array.isArray(product.ingredients) && product.ingredients.length > 0
      );
      console.log(merchandises);

      set({
        products: merchandises,
        isLoading: false,
        message: successMessage,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching merchandise";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
  fetchProductsByCategory: async (categoryId) => {
    set({ isLoading: true, error: null, products: [], message: null });
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

  addNewMenu: async (menuData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}product/add`, {
        name: menuData.name,
        basePrice: menuData.basePrice,
        image: menuData.image,
        status: menuData.status,
        stockQuantity: menuData.stockQuantity,
        categoryId: menuData.categoryId,
        sizes: menuData.sizes,
        ingredients: menuData.ingredients,
        recipe: menuData.recipe,
      });
      set({ products: response.data.products, isLoading: false });
      toast.success("Success add new menu");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching products";
      set({ error: errorMessage, isLoading: false, products: [] });
      toast.error(errorMessage);
    }
  },
}));
