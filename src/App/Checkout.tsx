import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePaymentStore } from '../stores/paymentStore';
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaLock, FaTruck, FaShieldAlt, FaChevronRight } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { Link } from 'react-router-dom';

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
  const location = useLocation();
  const cartItems = useSelector((state: any) => state.cart.items) as any[];
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;
  const user = authState?.user || null;

  // Support "buy now" flow: only checkout the single item from product page
  const buyNowState = location.state as { buyNow?: boolean; items?: any[] } | null;
  // For buy-now, use passed items; otherwise use full cart
  const checkoutItems = buyNowState?.buyNow && buyNowState.items?.length
    ? buyNowState.items
    : cartItems;

  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  const { initializePayment, verifyPayment, error: paymentError } = usePaymentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Nigeria',
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      if (user.name) setValue('fullName', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
    }
  }, [user]);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) return;
    if (!(window as any).PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setPaystackLoaded(true);
      document.head.appendChild(script);
    } else {
      setPaystackLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=/checkout`);
      return;
    }
    if (!checkoutItems || checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [checkoutItems, token, navigate]);

  const handlePaystackSuccess = async (reference: string) => {
    setLoading(true);
    try {
      await verifyPayment(reference, currentPaymentId!);
      navigate('/order-success', { state: { orderId: currentPaymentId } });
    } catch {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!checkoutItems || checkoutItems.length === 0) return;
    if (!paystackLoaded) {
      alert('Payment system is loading. Please try again in a moment.');
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

      // Map items to the format expected by backend: { product, quantity }
      const paymentItems = checkoutItems.map((item: any) => ({
        product: item.id || item._id || item.product,
        quantity: item.quantity,
      }));

      const result = await initializePayment(paymentItems, shippingAddress);
      setCurrentPaymentId(result.paymentId);
      setPaymentInitialized(true);

      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      const handler = ((window as any).PaystackPop).setup({
        key: publicKey,
        email: data.email,
        amount: totalPrice * 100, // in kobo
        ref: result.reference,
        currency: 'NGN',
        // Only allow standard card/bank/ussd channels to avoid OPay fraud issues
        channels: ['card', 'bank', 'ussd', 'bank_transfer'],
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: data.fullName },
            { display_name: 'Phone Number', variable_name: 'phone', value: data.phone },
          ],
        },
        onClose: () => {
          setLoading(false);
        },
        callback: (response: any) => {
          handlePaystackSuccess(response.reference);
        },
      });
      handler.openIframe();
    } catch (err: any) {
      setLoading(false);
    }
  };

  if (!checkoutItems || checkoutItems.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <FaSpinner className="animate-spin text-4xl text-orange-600" />
        </div>
      </Layout>
    );
  }

  const itemsPrice = checkoutItems.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const taxPrice = Math.round(itemsPrice * 0.07 * 100) / 100;
  const shippingPrice = itemsPrice > 50000 ? 0 : 1500;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <Link to="/cart" className="hover:text-orange-500 transition-colors">Cart</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-gray-900 font-medium">Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Checkout
            </h1>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
              <FaLock className="text-green-500 text-xs" />
              Secure, encrypted checkout
              {buyNowState?.buyNow && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                  Buy Now
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Contact */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
                  <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                      <input type="text" {...register('fullName')} className={inputClass} placeholder="John Doe" />
                      {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                      <input type="email" {...register('email')} className={inputClass} placeholder="john@example.com" />
                      {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <input type="tel" {...register('phone')} className={inputClass} placeholder="+234 (0) 123 456 7890" />
                      {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
                  <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Street Address</label>
                      <input type="text" {...register('address')} className={inputClass} placeholder="123 Main Street" />
                      {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                        <input type="text" {...register('city')} className={inputClass} placeholder="Lagos" />
                        {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Postal Code</label>
                        <input type="text" {...register('postalCode')} className={inputClass} placeholder="100001" />
                        {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
                      <input type="text" {...register('country')} className={inputClass} placeholder="Nigeria" />
                      {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment */}
                {!paymentInitialized && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">3</span>
                      Payment
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 mb-5">
                      <FaShieldAlt className="text-orange-500 text-xl flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">Powered by Paystack</p>
                        <p className="text-xs text-orange-600">Pay with card, bank transfer, or USSD. Safe & encrypted.</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 text-base shadow-lg shadow-orange-200"
                    >
                      {loading ? (
                        <><FaSpinner className="animate-spin" /> Processing...</>
                      ) : (
                        <><FaLock className="text-sm" /> Pay ₦{totalPrice.toLocaleString()} Securely</>
                      )}
                    </button>
                  </div>
                )}

                {paymentError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <FaExclamationCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm">Payment Error</h4>
                      <p className="text-sm text-red-700 mt-0.5">{paymentError}</p>
                      <p className="text-xs text-red-500 mt-1">Please try again or use a different payment method.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b">
                  Order Summary
                  <span className="ml-2 text-xs text-gray-400 font-normal">({checkoutItems.length} item{checkoutItems.length !== 1 ? 's' : ''})</span>
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {checkoutItems.map((item: any, idx: number) => (
                    <div key={item.id || item._id || idx} className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-orange-600">
                          ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-4 border-t text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₦{itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (7%)</span>
                    <span className="font-semibold text-gray-900">₦{taxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shippingPrice === 0 ? 'FREE 🎉' : `₦${shippingPrice.toLocaleString()}`}
                    </span>
                  </div>
                  {shippingPrice > 0 && (
                    <p className="text-[11px] text-gray-400 bg-orange-50 px-2 py-1 rounded">
                      💡 Add ₦{(50000 - itemsPrice).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 mt-3 border-t">
                  <span className="font-bold text-gray-900 text-sm">Total</span>
                  <span className="text-xl font-black text-orange-600">₦{totalPrice.toLocaleString()}</span>
                </div>

                {/* Trust badges */}
                <div className="mt-5 pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>256-bit SSL encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaTruck className="text-orange-500 flex-shrink-0" />
                    <span>3–7 business day delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaShieldAlt className="text-purple-500 flex-shrink-0" />
                    <span>7-day hassle-free returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
