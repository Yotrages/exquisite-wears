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
  initializePayment: (items: any[], shippingAddress: any) => Promise<{reference: string; paymentId: string; authorizationUrl: string}>;
  verifyPayment: (reference: string, paymentId: string) => Promise<void>;
  clearError: () => void;
  resetPayment: () => void;
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
      const response = await apiClient.post(
        '/payments/initialize',
        { items, shippingAddress }
      );

      if (response.data.reference && response.data.authorizationUrl) {
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
      const errorMsg = error.response?.data?.error || 'Failed to initialize payment';
      set({
        error: errorMsg,
        loading: false,
      });
      throw error;
    }
  },

  verifyPayment: async (reference: string, paymentId: string) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post(
        '/payments/verify',
        { reference, paymentId }
      );

      set({
        success: true,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || 'Failed to verify payment',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  resetPayment: () => set({
    reference: null,
    paymentId: null,
    success: false,
    error: null,
  }),
}));
