import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePaymentStore } from '../stores/paymentStore';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const items = useSelector((state: any) => state.cart.items) as any[];
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;
  
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  const { initializePayment, verifyPayment, error: paymentError } = usePaymentStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Load Paystack script
  useEffect(() => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Paystack Public Key not found in environment variables');
      return;
    }

    if (!(window as any).PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      script.onerror = () => console.error('Failed to load Paystack SDK');
      document.head.appendChild(script);
    } else {
      setPaystackLoaded(true);
    }
  }, []);

  // Redirect if no cart
  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=/checkout`);
      return;
    }
    if (!items || items?.length === 0) {
      navigate('/cart');
    }
  }, [items, token, navigate]);

  const handlePaystackSuccess = async (reference: string) => {
    setLoading(true);
    try {
      await verifyPayment(reference, currentPaymentId!);
      navigate('/order-success', { state: { orderId: currentPaymentId } });
    } catch (err) {
      console.error('Payment verification failed:', err);
      setLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!items || items?.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!paystackLoaded) {
      alert('Paystack SDK is still loading. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      };

      // Transform items to match backend expected format
      const paymentItems = items.map((item: any) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const result = await initializePayment(paymentItems, shippingAddress);
      
      setCurrentPaymentId(result.paymentId);
      setPaymentInitialized(true);

      // Open Paystack payment modal
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      
      // Calculate the total amount in kobo (Paystack expects amount in kobo)
      const totalAmountInKobo = totalPrice * 100;
      
      const handler = ((window as any).PaystackPop).setup({
        key: publicKey,
        email: data.email,
        amount: totalAmountInKobo, // Amount in kobo
        ref: result.reference,
        onClose: () => {
          console.log('Payment closed');
          setLoading(false);
        },
        onSuccess: (response: any) => {
          handlePaystackSuccess(response.reference);
        },
      });
      
      handler.openIframe();
    } catch (err: any) {
      console.error('Payment initialization failed:', err);
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  // Calculate totals
  const itemsPrice = items?.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
    0
  ) || 0;
  const taxPrice = Math.round(itemsPrice * 0.07 * 100) / 100;
  const shippingPrice = itemsPrice > 50000 ? 0 : 1500;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      {...register('fullName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+234 (0) 123 456 7890"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      id="address"
                      type="text"
                      {...register('address')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        id="city"
                        type="text"
                        {...register('city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Lagos"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        {...register('postalCode')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="100001"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      id="country"
                      type="text"
                      {...register('country')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nigeria"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {!paymentInitialized && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    We accept secure Paystack payments for your convenience
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Paystack'
                    )}
                  </button>
                </div>
              )}

              {/* Error Message */}
              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <FaExclamationCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Payment Error</h4>
                    <p className="text-sm text-red-700">{paymentError}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-4 pb-4 border-b border-gray-200">
                {items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₦{((item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">₦{itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="text-gray-900 font-medium">₦{taxPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {shippingPrice === 0 && <span className="text-green-600">(Free)</span>}
                  </span>
                  <span className="text-gray-900 font-medium">₦{shippingPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">₦{totalPrice.toLocaleString()}</span>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-200">
                <FaCheckCircle className="inline text-green-600 mr-2" />
                Your payment is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;