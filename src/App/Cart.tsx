import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeItem, setCart } from '../redux/cartSlice';
import { apiClient } from '../Api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cookieManager';
import Layout from '../Components/Layout';
import { FaShoppingCart, FaTrash, FaHeart, FaArrowRight, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  availableStock?: number;
}

const Cart = () => {
  const items = useSelector((state: any) => state.cart.items) as CartItem[];
  const dispatch = useDispatch();
  const [syncing, setSyncing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    syncFromServer();
  }, []);

  const syncFromServer = async () => {
    const token = getAuthToken() || null;
    if (!token) return;
    try {
      setSyncing(true);
      const res = await apiClient.get('/cart');
      const serverCart = res.data.items || [];
      const items = (serverCart || []).map((it: any) => ({
        id: it.product._id || it.product,
        name: it.product.name,
        price: it.product.price,
        image: it.product.image,
        quantity: it.quantity,
        availableStock: it.product.quantity
      }));
      // Use setCart to replace local state with server authoritative cart
      dispatch(setCart({ items }));
    } catch (err) {
      console.error('Failed to sync cart', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleChangeQty = async (id: string, qty: number) => {
    if (qty < 1) {
      handleRemove(id);
      return;
    }
    dispatch(updateQuantity({ id, quantity: qty }));
    const token = getAuthToken() || null;
    if (token) {
      try {
        const res = await apiClient.put(
          '/cart/update',
          { productId: id, quantity: qty }
        );
        if (res.data?.cart?.items && Array.isArray(res.data.cart.items)) {
          const items = res.data.cart.items.map((it: any) => ({
            id: it.product._id || it.product,
            name: it.product.name,
            price: it.product.price,
            image: it.product.image,
            quantity: it.quantity,
            availableStock: it.product.quantity
          }))
          dispatch(setCart({ items }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemove = async (id: string) => {
    dispatch(removeItem({ id }));
    const token = getAuthToken() || null;
    if (token) {
      try {
        const res = await apiClient.put(
          '/cart/update',
          { productId: id, quantity: 0 }
        );
        if (res.data?.cart?.items && Array.isArray(res.data.cart.items)) {
          const items = res.data.cart.items.map((it: any) => ({
            id: it.product._id || it.product,
            name: it.product.name,
            price: it.product.price,
            image: it.product.image,
            quantity: it.quantity,
            availableStock: it.product.quantity
          }))
          dispatch(setCart({ items }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const moveToWishlist = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await apiClient.post(
          `/wishlist/product/${id}`,
        { productId: id }
      );
      handleRemove(id);
    } catch (err) {
      console.error('Failed to move to wishlist:', err);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // This would call your backend coupon validation endpoint
    // For now, we'll simulate it
    setCouponError('');
    // Simulated coupon validation
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponDiscount(10);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const subtotal = items.reduce((s: number, it: CartItem) => s + (it.price || 0) * it.quantity, 0);
  const discount = (subtotal * couponDiscount) / 100;
  const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
  const total = subtotal - discount + shipping;

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaShoppingCart className="text-3xl text-blue-600" />
          <h1 className="xs:text-3xl text-xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {syncing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
            Syncing cart...
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {items.map((it: CartItem) => (
                  <div
                    key={it.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={it.image || '/placeholder-product.jpg'}
                        alt={it.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => navigate(`/product/${it.id}`)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3
                        className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => navigate(`/product/${it.id}`)}
                      >
                        {it.name}
                      </h3>

                      <div className="text-lg font-bold text-blue-600 mb-3">
                        ₦{(it.price || 0).toLocaleString()}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleChangeQty(it.id, it.quantity - 1)}
                            className="px-4 py-2 hover:bg-gray-100 transition-colors font-semibold"
                          >
                            -
                          </button>
                          <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => handleChangeQty(it.id, it.quantity + 1)}
                            disabled={!!(it.availableStock && it.quantity >= it.availableStock)}
                            className="px-4 py-2 hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        {it.availableStock && it.availableStock <= 5 && (
                          <span className="text-sm text-orange-600 font-semibold">
                            Only {it.availableStock} left in stock!
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleRemove(it.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                        >
                          <FaTrash /> Remove
                        </button>
                        <button
                          onClick={() => moveToWishlist(it.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold text-sm transition-colors"
                        >
                          <FaHeart /> Save for Later
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-xl font-bold text-gray-900">
                        ₦{((it.price || 0) * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex xs:flex-row flex-col gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gray-800 xs:text-base text-sm hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-sm text-red-600 mt-1">{couponError}</p>}
                  {couponDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Coupon applied! {couponDiscount}% off
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({couponDiscount}%)</span>
                      <span className="font-semibold">-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₦${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-600">
                      Free shipping on orders over ₦50,000
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">₦{total.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <FaArrowRight />
                </button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaTruck className="text-xl text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">Fast Delivery</p>
                      <p className="text-xs text-gray-600">Delivered within 3-7 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaShieldAlt className="text-xl text-green-600" />
                    <div>
                      <p className="font-semibold text-sm">Secure Payment</p>
                      <p className="text-xs text-gray-600">100% protected payments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaUndo className="text-xl text-orange-600" />
                    <div>
                      <p className="font-semibold text-sm">Easy Returns</p>
                      <p className="text-xs text-gray-600">7-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
