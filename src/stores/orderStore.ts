import { create } from 'zustand';
import { apiClient } from '../Api/axiosConfig';

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  isPaid: boolean;
  createdAt: string;
  trackingNumber?: string;
  deliveryDate?: string;
  deliveredAt?: string;
  notes?: string;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
  };
  paymentMethod?: string;
  prices?: {
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  };
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<void>;
  cancelOrder: (id: string, reason: string) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/orders');
      set({ orders: response.data.orders, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch orders',
        loading: false,
      });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/orders/${id}`);
      set({ currentOrder: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch order',
        loading: false,
      });
    }
  },

  createOrder: async (orderData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/orders', orderData);
      set({ currentOrder: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to create order',
        loading: false,
      });
    }
  },

  cancelOrder: async (id: string, reason: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/orders/${id}/cancel`, { reason });
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to cancel order',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
