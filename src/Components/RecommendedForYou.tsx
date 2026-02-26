import { useEffect, useState } from 'react';
import { apiClient } from '../Api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { FaRobot, FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addItem, setCart } from '../redux/cartSlice';
import { Product } from '../Types/Product';

const RecommendedForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  useEffect(() => {
    if (token) {
      fetchRecommendations();
      fetchWishlist();
    }
  }, [token]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/recommendations/for-you');
      const list = Array.isArray(res.data?.recommendations)
        ? res.data.recommendations
        : Array.isArray(res.data)
        ? res.data
        : [];
      setProducts(list.slice(0, 8));
    } catch {
      // Fallback to regular products
      try {
        const fallback = await apiClient.get('/products/get?limit=8&sort=rating');
        const list = fallback.data?.products || fallback.data || [];
        setProducts(Array.isArray(list) ? list.slice(0, 8) : []);
      } catch {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await apiClient.get('/wishlist');
      setWishlist((res.data.items || []).map((i: any) => i.product?._id).filter(Boolean));
    } catch {}
  };

  const getImage = (product: Product): string => {
    if (product.image && product.image.startsWith('http')) return product.image;
    if (product.images && product.images.length > 0) {
      const valid = product.images.find(img => img && img.startsWith('http'));
      if (valid) return valid;
    }
    return '/placeholder-product.jpg';
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Please log in first');
      navigate('/login?redirect=/');
      return;
    }
    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1, image: getImage(product) }));
    try {
      const res = await apiClient.post('/cart/add', { productId: product._id, quantity: 1 });
      if (res.data?.cart?.items) {
        dispatch(setCart({
          items: res.data.cart.items.map((it: any) => ({
            id: it.product._id || it.product,
            name: it.product.name,
            price: it.product.price,
            image: it.product.image,
            quantity: it.quantity,
            stock: it.product.quantity,
          })),
        }));
      }
      toast.success('Added to cart!');
    } catch {}
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    try {
      if (wishlist.includes(productId)) {
        await apiClient.delete(`/wishlist/product/${productId}`);
        setWishlist(w => w.filter(id => id !== productId));
      } else {
        await apiClient.post(`/wishlist/product/${productId}`, { productId });
        setWishlist(w => [...w, productId]);
        toast.success('Added to wishlist!');
      }
    } catch {}
  };

  if (!token) return null;

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <FaRobot className="text-2xl text-purple-600" />
            <div className="h-7 w-56 shimmer rounded" />
          </div>
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-8 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="section-header mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-purple-500" />
            <FaRobot className="text-purple-600 text-xl" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Recommended For You
              </h2>
              <p className="text-xs text-purple-500 font-semibold">AI-powered picks just for you</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/search/all')}
            className="text-sm font-semibold text-purple-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
          >
            See more →
          </button>
        </div>

        {/* Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card group"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={getImage(product)}
                  alt={product.name}
                  className="product-img w-full h-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                />
                {/* AI badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <FaRobot className="text-[9px]" /> For You
                </div>
                {/* Wishlist */}
                <button
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-10"
                  onClick={(e) => toggleWishlist(e, product._id)}
                >
                  {wishlist.includes(product._id)
                    ? <FaHeart className="text-red-500 text-sm" />
                    : <FaRegHeart className="text-gray-400 text-sm" />}
                </button>
                {/* Discount badge */}
                {product.discount && product.discount > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="badge badge-danger text-[10px]">-{product.discount}%</span>
                  </div>
                )}
                {/* Out of stock overlay */}
                {!(product.quantity || 0) && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Rating */}
                {(product.rating || product.averageRating) && (
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <FaStar
                          key={s}
                          className={`text-[10px] ${s <= Math.round(product.rating || product.averageRating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">
                      ({product.reviewsCount || product.totalReviews || 0})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-2.5">
                  <span className="text-sm font-black text-gray-900">₦{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to cart */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!(product.quantity || 0)}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    (product.quantity || 0)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {(product.quantity || 0) ? (
                    <><FaShoppingCart className="text-[11px]" /> Add to Cart</>
                  ) : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;
