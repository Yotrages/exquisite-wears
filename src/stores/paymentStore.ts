import { create } from 'zustand';
import { apiClient } from '../Api/axiosConfig';

interface PaymentState {
  publicKey: string | null;
  reference: string | null;
  paymentId: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;

  // Actions
  initializePayment: (items: any[], shippingAddress: any) => Promise<{ reference: string; paymentId: string; authorizationUrl: string }>;
  verifyPayment: (reference: string, paymentId: string) => Promise<void>;
  clearError: () => void;
  resetPayment: () => void;
  resetLoading: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || null,
  reference: null,
  paymentId: null,
  loading: false,
  error: null,
  success: false,

  initializePayment: async (items: any[], shippingAddress: any) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/payments/initialize', { items, shippingAddress });

      if (response.data.reference && response.data.paymentId) {
        // ✅ Reset loading immediately after init — the Paystack popup handles the UX from here.
        // The checkout component manages its own `loading` state for the button.
        set({
          reference: response.data.reference,
          paymentId: response.data.paymentId,
          loading: false,
        });
        return {
          reference: response.data.reference,
          paymentId: response.data.paymentId,
          authorizationUrl: response.data.authorizationUrl,
        };
      }
      throw new Error('Invalid response from payment initialization');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to initialize payment';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  verifyPayment: async (reference: string, paymentId: string) => {
    // Note: we intentionally do NOT set loading: true here.
    // The checkout page manages the loading button state via its own useState.
    // Setting store loading here can re-render and hide the pay button prematurely.
    set({ error: null });
    try {
      await apiClient.post('/payments/verify', { reference, paymentId });
      set({ success: true, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to verify payment',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  resetLoading: () => set({ loading: false }),

  resetPayment: () =>
    set({
      reference: null,
      paymentId: null,
      success: false,
      error: null,
      loading: false,
    }),
}));
