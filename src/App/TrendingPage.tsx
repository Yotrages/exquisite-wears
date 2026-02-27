import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../Api/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import { FaFire, FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { Product } from '../Types/Product';

const TrendingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    apiClient.get('/products/trending')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        // Fallback to general products
        apiClient.get('/products/get?limit=40')
          .then(res => setProducts(res.data?.products || []))
          .catch(() => {})
      })
      .finally(() => setLoading(false));

    if (token) {
      apiClient.get('/wishlist')
        .then(res => setWishlist((res.data.items || []).map((i: any) => i.product?._id).filter(Boolean)))
        .catch(() => {});
    }
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!token) { toast.error('Please log in'); navigate('/login'); return; }
    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1, image: product.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: product._id, quantity: 1 });
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

  const getImage = (p: Product) => p.image || (p.images?.[0]) || '/placeholder-product.jpg';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-2 text-orange-200 text-xs mb-3">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-white font-medium">Trending Products</span>
            </div>
            <div className="flex items-center gap-3">
              <FaFire className="text-3xl text-yellow-300 animate-pulse" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>Trending Now 🔥</h1>
                <p className="text-orange-100 text-sm mt-1">
                  {loading ? 'Loading trending products...' : `${products.length} hot products people are buying`}
                </p>
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
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No trending products yet</h3>
              <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
                Back to Home
              </button>
            </div>
          ) : (
            <div className="product-grid-wide">
              {products.map((product, idx) => (
                <div key={product._id} className="product-card group" onClick={() => navigate(`/product/${product._id}`)}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img src={getImage(product)} alt={product.name} className="product-img w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10" onClick={e => toggleWishlist(e, product._id)}>
                      {wishlist.includes(product._id) ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
                    </button>
                    {/* Trending rank badge */}
                    {idx < 3 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaFire className="text-[9px] text-yellow-300" /> #{idx + 1}
                      </div>
                    )}
                    {product.discount && product.discount > 0 && <span className="absolute bottom-2 left-2 badge badge-danger text-[10px]">-{product.discount}%</span>}
                    {!(product.quantity || 0) && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span></div>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex">{stars(product.rating || 0)}</div>
                      <span className="text-[10px] text-gray-400">({product.reviewsCount || product.reviews || 0})</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2.5">
                      <span className="text-sm font-black text-gray-900">₦{product.price.toLocaleString()}</span>
                      {product.originalPrice && <span className="text-[11px] text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>}
                    </div>
                    <button onClick={e => handleAddToCart(e, product)} disabled={!(product.quantity || 0)} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${(product.quantity || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      {(product.quantity || 0) ? <><FaShoppingCart className="text-[11px]" /> Add to Cart</> : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrendingPage;
