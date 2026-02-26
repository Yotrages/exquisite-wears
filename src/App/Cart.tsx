import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeItem, setCart } from '../redux/cartSlice';
import { apiClient } from '../Api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cookieManager';
import Layout from '../Components/Layout';
import {
  FaShoppingCart, FaTrash, FaHeart, FaArrowRight,
  FaTruck, FaShieldAlt, FaUndo, FaChevronRight, FaMinus, FaPlus
} from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import toast from 'react-hot-toast';

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
  const [couponApplied, setCouponApplied] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { syncFromServer(); }, []);

  const syncFromServer = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      setSyncing(true);
      const res = await apiClient.get('/cart');
      dispatch(setCart({ items: (res.data.items || []).map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, availableStock: it.product.quantity })) }));
    } catch { }
    finally { setSyncing(false); }
  };

  const handleChangeQty = async (id: string, qty: number) => {
    if (qty < 1) { handleRemove(id); return; }
    dispatch(updateQuantity({ id, quantity: qty }));
    const token = getAuthToken();
    if (token) {
      try { await apiClient.put('/cart/update', { productId: id, quantity: qty }); }
      catch { syncFromServer(); }
    }
  };

  const handleRemove = async (id: string) => {
    setRemoving(id);
    dispatch(removeItem({ id }));
    const token = getAuthToken();
    if (token) {
      try { await apiClient.put('/cart/update', { productId: id, quantity: 0 }); }
      catch { syncFromServer(); }
    }
    setRemoving(null);
    toast.success('Removed from cart');
  };

  const moveToWishlist = async (id: string) => {
    const token = getAuthToken();
    if (!token) { navigate('/login'); return; }
    try {
      await apiClient.post(`/wishlist/product/${id}`, { productId: id });
      handleRemove(id);
      toast.success('Moved to wishlist!');
    } catch { toast.error('Failed to move'); }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) { setCouponError('Please enter a coupon code'); return; }
    setCouponError('');
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponDiscount(10); setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try "SAVE10"');
    }
  };

  const removeCoupon = () => { setCouponDiscount(0); setCouponApplied(false); setCouponCode(''); };

  const subtotal = items.reduce((s: number, it: CartItem) => s + (it.price || 0) * it.quantity, 0);
  const discount = Math.round((subtotal * couponDiscount) / 100);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal - discount + shipping;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">Home</button>
            <FaChevronRight className="text-[10px]" />
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FaShoppingCart className="text-xl text-orange-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Shopping Cart</h1>
            {items.length > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">{items.length} item{items.length > 1 ? 's' : ''}</span>
            )}
            {syncing && <span className="text-xs text-gray-400 animate-pulse">Syncing...</span>}
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <HiOutlineShoppingBag className="text-4xl text-orange-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your cart is empty</h2>
              <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">Looks like you haven't added anything to your cart yet</p>
              <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all active:scale-95">
                <HiOutlineShoppingBag className="text-lg" /> Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-3">
                {/* Free shipping bar */}
                {subtotal < 50000 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-orange-500 text-sm" />
                      <span className="text-sm font-semibold text-orange-700">
                        Add ₦{(50000 - subtotal).toLocaleString()} more for free delivery!
                      </span>
                    </div>
                    <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 50000) * 100)}%` }} />
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {items.map((it: CartItem, idx: number) => (
                    <div key={it.id} className={`flex gap-4 p-4 ${idx < items.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                      {/* Image */}
                      <div className="flex-shrink-0 w-20 sm:w-24 h-20 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => navigate(`/product/${it.id}`)}>
                        <img src={it.image || '/placeholder.jpg'} alt={it.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors mb-1"
                          onClick={() => navigate(`/product/${it.id}`)}
                        >
                          {it.name}
                        </h3>
                        <p className="text-sm font-bold text-gray-900 mb-2">₦{(it.price || 0).toLocaleString()}</p>

                        {/* Qty + actions */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => handleChangeQty(it.id, it.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-900 border-x border-gray-200">{it.quantity}</span>
                            <button
                              onClick={() => handleChangeQty(it.id, it.quantity + 1)}
                              disabled={!!(it.availableStock && it.quantity >= it.availableStock)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-40"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>

                          {it.availableStock && it.availableStock <= 5 && (
                            <span className="text-xs text-orange-600 font-semibold">Only {it.availableStock} left!</span>
                          )}

                          <button onClick={() => moveToWishlist(it.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                            <FaHeart className="text-xs" /> Save
                          </button>
                          <button
                            onClick={() => handleRemove(it.id)}
                            disabled={removing === it.id}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {removing === it.id ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <FaTrash className="text-xs" />}
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">Subtotal</p>
                        <p className="font-bold text-gray-900 text-sm sm:text-base">₦{((it.price || 0) * it.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1">
                  ← Continue Shopping
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-32 space-y-5">
                  <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Order Summary</h2>

                  {/* Coupon */}
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Coupon Code</label>
                    {couponApplied ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                        <div>
                          <p className="text-xs font-bold text-green-700">{couponCode.toUpperCase()} applied!</p>
                          <p className="text-xs text-green-600">{couponDiscount}% discount</p>
                        </div>
                        <button onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors text-xs underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                            placeholder="e.g. SAVE10"
                            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none"
                          />
                          <button onClick={applyCoupon} className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-semibold transition-colors">
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                      </>
                    )}
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2.5 pb-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({items.length} items)</span>
                      <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount ({couponDiscount}%)</span>
                        <span className="font-semibold text-green-600">-₦{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {shipping === 0 ? '🎉 FREE' : `₦${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping > 0 && <p className="text-xs text-orange-600">Free delivery on orders above ₦50,000</p>}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>₦{total.toLocaleString()}</span>
                      {couponDiscount > 0 && <p className="text-xs text-green-600">You save ₦{discount.toLocaleString()}</p>}
                    </div>
                  </div>

                  {/* Checkout */}
                  <Link
                    to="/checkout"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                  >
                    Proceed to Checkout
                    <FaArrowRight className="text-xs" />
                  </Link>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                    {[
                      { icon: FaTruck, label: 'Fast Delivery', color: 'text-blue-500' },
                      { icon: FaShieldAlt, label: 'Secure Pay', color: 'text-green-500' },
                      { icon: FaUndo, label: 'Easy Return', color: 'text-orange-500' },
                    ].map(({ icon: Icon, label, color }) => (
                      <div key={label} className="text-center">
                        <Icon className={`${color} text-lg mx-auto mb-1`} />
                        <p className="text-[10px] text-gray-500 font-medium">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
