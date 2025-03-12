import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api/"
    : "/api/";

axios.defaults.withCredentials = true;

export const useOrderStore = create((set) => ({
  orders: [],
  error: null,
  isLoading: false,
  message: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}order/all`);
      // console.log(response.data.orders);
      set({ orders: response.data.orders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching orders";
      set({
        error: errorMessage || "Error fetching orders",
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },
}));
