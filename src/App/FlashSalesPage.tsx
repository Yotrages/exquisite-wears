import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../Api/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import { FaBolt, FaFire, FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import Layout from '../Components/Layout';
import Countdown from '../Components/Countdown';

interface FlashDeal {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images?: string[];
  quantity: number;
  rating?: number;
  reviewsCount?: number;
  brand?: string;
}

const FlashSalesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiClient.get('/products/flash-deals')
      .then(res => setDeals((Array.isArray(res.data) ? res.data : res.data?.items || []).slice(0, 40)))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (token) {
      apiClient.get('/wishlist')
        .then(res => setWishlist((res.data.items || []).map((i: any) => i.product?._id).filter(Boolean)))
        .catch(() => {});
    }
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, item: FlashDeal) => {
    e.stopPropagation();
    if (!token) { toast.error('Please log in'); navigate('/login'); return; }
    dispatch(addItem({ id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: item._id, quantity: 1 });
      if (res.data?.cart?.items) {
        dispatch(setCart({ items: res.data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }));
      }
    } catch { }
    toast.success('Added to cart!');
  };

  const toggleWishlist = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    try {
      if (wishlist.includes(id)) {
        await apiClient.delete(`/wishlist/product/${id}`);
        setWishlist(w => w.filter(x => x !== id));
      } else {
        await apiClient.post(`/wishlist/product/${id}`, { productId: id });
        setWishlist(w => [...w, id]);
        toast.success('Added to wishlist!');
      }
    } catch { }
  };

  const stars = (r = 0) => [1,2,3,4,5].map(s => (
    <FaStar key={s} className={`text-[10px] ${s <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'}`} />
  ));

  const getImage = (d: FlashDeal) => d.image || d.images?.[0] || '/placeholder-product.jpg';

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="bg-gray-900 text-white text-xl font-black px-3 py-1.5 rounded-lg tabular-nums min-w-[48px] text-center">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-500 mt-1 font-medium">{label}</span>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex items-center gap-2 text-red-200 text-xs mb-3">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-white font-medium">Flash Sales</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FaBolt className="text-3xl text-yellow-300 animate-pulse" />
                  <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Flash Sales
                  </h1>
                  <FaFire className="text-2xl text-yellow-300 animate-pulse" />
                </div>
                <p className="text-red-100 text-sm">
                  {loading ? 'Loading deals...' : `${deals.length} deals with up to ${deals[0]?.discount || 0}% off`}
                </p>
              </div>

              {/* Countdown */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-red-200 text-xs font-semibold mb-2 text-center">⏰ Deals end in</p>
                <div className="flex items-end gap-2">
                  <TimeBlock value={timeLeft.hours} label="Hours" />
                  <span className="text-2xl font-black text-yellow-300 mb-4">:</span>
                  <TimeBlock value={timeLeft.minutes} label="Mins" />
                  <span className="text-2xl font-black text-yellow-300 mb-4">:</span>
                  <TimeBlock value={timeLeft.seconds} label="Secs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="product-grid-wide">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <div className="aspect-square shimmer" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 shimmer rounded w-3/4" />
                    <div className="h-3 shimmer rounded w-1/2" />
                    <div className="h-8 shimmer rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Flash Deals Right Now</h3>
              <p className="text-gray-500 mb-6 text-sm">Check back later for amazing deals!</p>
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
                Back to Home
              </button>
            </div>
          ) : (
            <div className="product-grid-wide">
              {deals.map(deal => {
                const savingsAmt = deal.originalPrice - deal.price;
                return (
                  <div key={deal._id} className="product-card group relative" onClick={() => navigate(`/product/${deal._id}`)}>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img src={getImage(deal)} alt={deal.name} className="product-img w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                      {/* Discount badge */}
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaBolt className="text-[10px] text-yellow-300" /> -{deal.discount}%
                      </div>
                      {/* Wishlist */}
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10" onClick={e => toggleWishlist(e, deal._id)}>
                        {wishlist.includes(deal._id) ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
                      </button>
                      {/* Out of stock overlay */}
                      {!deal.quantity && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span></div>}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{deal.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="flex">{stars(deal.rating || 0)}</div>
                        <span className="text-[10px] text-gray-400">({deal.reviewsCount || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-sm font-black text-orange-500">₦{deal.price.toLocaleString()}</span>
                        <span className="text-[11px] text-gray-400 line-through">₦{deal.originalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mb-2">
                        <MdLocalOffer /> Save ₦{savingsAmt.toLocaleString()}
                      </p>

                      {/* Stock bar */}
                      {deal.quantity > 0 && (
                        <div className="mb-2.5">
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(90, 100 - Math.min(deal.quantity / 2, 90))}%` }} />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">🔥 Selling fast</p>
                        </div>
                      )}

                      <button onClick={e => handleAddToCart(e, deal)} disabled={!deal.quantity} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${deal.quantity ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                        {deal.quantity ? <><FaShoppingCart className="text-[11px]" /> Add to Cart</> : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FlashSalesPage;
