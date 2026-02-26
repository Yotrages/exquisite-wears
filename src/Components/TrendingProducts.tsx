import { useEffect, useState } from 'react';
import { apiClient } from '../Api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FaFire, FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import { addItem, setCart } from '../redux/cartSlice';
import { Product } from '../Types/Product';
import { getAuthToken } from '../utils/cookieManager';

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  useEffect(() => {
    apiClient.get('/products/get?limit=10&sort=popular')
      .then(res => setProducts(res.data.products || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    if (token) {
      apiClient.get('/wishlist')
        .then(res => setWishlist((res.data.items || []).map((i: any) => i.product._id)))
        .catch(() => {});
    }
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!token) { toast.error('Please log in first'); navigate('/login?redirect=/'); return; }
    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1, image: product.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: product._id, quantity: 1 });
      if (res.data?.cart?.items) {
        dispatch(setCart({ items: res.data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }));
      }
    } catch { }
    toast.success('Added to cart!');
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
      }
    } catch { }
  };

  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 shimmer rounded mb-5" />
          <div className="product-grid">
            {[...Array(10)].map((_, i) => (
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
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="section-header mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-orange-500" />
            <FaFire className="text-orange-500 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Trending Products
            </h2>
          </div>
          <button onClick={() => navigate('/search/trending')} className="section-link">
            View all <FaChevronRight className="text-xs" />
          </button>
        </div>

        {/* Grid */}
        <div className="product-grid stagger-children">
          {products.slice(0, 10).map((product) => (
            <div
              key={product._id}
              className="product-card animate-fade-in-up opacity-0"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image || (product as any).images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="product-img w-full h-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                />
                {/* Wishlist */}
                <button
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
                  onClick={(e) => toggleWishlist(e, product._id)}
                >
                  {wishlist.includes(product._id)
                    ? <FaHeart className="text-red-500 text-sm" />
                    : <FaRegHeart className="text-gray-400 text-sm" />}
                </button>

                {/* Trending badge */}
                <div className="absolute top-2 left-2">
                  <span className="badge badge-primary text-[10px] flex items-center gap-1">
                    <FaFire className="text-[9px]" /> Hot
                  </span>
                </div>

                {/* Discount badge */}
                {product.discount && product.discount > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="badge badge-danger text-[10px]">-{product.discount}%</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{product.name}</h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} className={`text-[10px] ${s <= Math.round(product.rating!) ? 'text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">({product.reviews || 0})</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-2.5">
                  <span className="text-sm font-black text-gray-900">₦{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Add to cart */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  disabled={!product.quantity}
                  className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                    product.quantity
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.quantity ? (
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

export default TrendingProducts;
