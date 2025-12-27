import { create } from 'zustand';
import { apiClient } from '../Api/axiosConfig';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalInventoryValue: number;
}

interface AdminState {
  stats: DashboardStats | null;
  salesAnalytics: any;
  inventoryAnalytics: any;
  customerAnalytics: any;
  paymentAnalytics: any;
  performanceMetrics: any;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDashboardStats: () => Promise<void>;
  fetchSalesAnalytics: (days: number) => Promise<void>;
  fetchInventoryAnalytics: () => Promise<void>;
  fetchCustomerAnalytics: () => Promise<void>;
  fetchPaymentAnalytics: () => Promise<void>;
  fetchPerformanceMetrics: () => Promise<void>;
  fetchAllAnalytics: () => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  salesAnalytics: null,
  inventoryAnalytics: null,
  customerAnalytics: null,
  paymentAnalytics: null,
  performanceMetrics: null,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      set({ stats: response.data.stats, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch dashboard stats',
        loading: false,
      });
    }
  },

  fetchSalesAnalytics: async (days: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/admin/analytics/sales?days=${days}`);
      set({ salesAnalytics: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch sales analytics',
        loading: false,
      });
    }
  },

  fetchInventoryAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/analytics/inventory');
      set({ inventoryAnalytics: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch inventory analytics',
        loading: false,
      });
    }
  },

  fetchCustomerAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/analytics/customers');
      set({ customerAnalytics: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch customer analytics',
        loading: false,
      });
    }
  },

  fetchPaymentAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/analytics/payments');
      set({ paymentAnalytics: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch payment analytics',
        loading: false,
      });
    }
  },

  fetchPerformanceMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/admin/analytics/performance');
      set({ performanceMetrics: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch performance metrics',
        loading: false,
      });
    }
  },

  fetchAllAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const [stats, sales, inventory, customers, payments, performance] = await Promise.all([
        apiClient.get('/admin/dashboard/stats'),
        apiClient.get('/admin/analytics/sales?days=30'),
        apiClient.get('/admin/analytics/inventory'),
        apiClient.get('/admin/analytics/customers'),
        apiClient.get('/admin/analytics/payments'),
        apiClient.get('/admin/analytics/performance'),
      ]);

      set({
        stats: stats.data.stats,
        salesAnalytics: sales.data,
        inventoryAnalytics: inventory.data,
        customerAnalytics: customers.data,
        paymentAnalytics: payments.data,
        performanceMetrics: performance.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to fetch analytics',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
