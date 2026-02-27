import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../Api/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaChevronRight, FaFilter, FaTh, FaList, FaChevronDown } from 'react-icons/fa';
import Layout from '../Components/Layout';
import { Product } from '../Types/Product';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceMax, setPriceMax] = useState(1000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    apiClient.get(`/search?categories=${encodeURIComponent(category)}&limit=60`)
      .then(res => {
        const items = res.data?.products || [];
        setProducts(items);
        setFilteredProducts(items);
      })
      .catch(() => {
        // Fallback: try product search
        apiClient.get(`/products/search?query=${encodeURIComponent(category)}`)
          .then(res => {
            const items = Array.isArray(res.data) ? res.data : [];
            setProducts(items);
            setFilteredProducts(items);
          })
          .catch(() => {})
      })
      .finally(() => setLoading(false));

    if (token) {
      apiClient.get('/wishlist')
        .then(res => setWishlist((res.data.items || []).map((i: any) => i.product?._id).filter(Boolean)))
        .catch(() => {});
    }
  }, [category]);

  useEffect(() => {
    let f = [...products].filter(p => p.price <= priceMax);
    if (inStockOnly) f = f.filter(p => (p.quantity || 0) > 0);
    if (sortBy === 'price-low') f.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') f.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') f.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else f.reverse(); // newest
    setFilteredProducts(f);
  }, [products, sortBy, priceMax, inStockOnly]);

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
    } catch { }
  };

  const stars = (r = 0) => [1,2,3,4,5].map(s => (
    <FaStar key={s} className={`text-[10px] ${s <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'}`} />
  ));

  const getImage = (p: Product) => p.image || (p.images?.[0]) || '/placeholder-product.jpg';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-2 text-xs text-orange-200 mb-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-white font-medium">{category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {category}
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              {loading ? 'Loading products...' : `${filteredProducts.length} products found`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Controls bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-all lg:hidden ${showFilters ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-600 border-gray-200 hover:border-orange-300'}`}
              >
                <FaFilter className="text-xs" /> Filters
              </button>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FaTh className="text-sm" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FaList className="text-sm" /></button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none bg-white">
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-5">
            {/* Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-56 flex-shrink-0`}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-32">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Filters</h3>
                {/* Price */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Max Price</h4>
                  <input type="range" min="0" max="1000000" step="5000" value={priceMax} onChange={e => setPriceMax(+e.target.value)} className="w-full accent-orange-500" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₦0</span>
                    <span className="font-semibold text-gray-900">₦{priceMax.toLocaleString()}</span>
                  </div>
                </div>
                {/* In stock */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-3.5 h-3.5 accent-orange-500 rounded" />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
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
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products in {category} yet</h3>
                  <p className="text-gray-500 mb-5 text-sm">Check back soon or explore other categories.</p>
                  <button onClick={() => navigate('/')} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
                    Back to Home
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'product-grid-wide' : 'space-y-3'}>
                  {filteredProducts.map(item => (
                    viewMode === 'grid' ? (
                      <div key={item._id} className="product-card" onClick={() => navigate(`/product/${item._id}`)}>
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <img src={getImage(item)} alt={item.name} className="product-img w-full h-full" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                          <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10" onClick={e => toggleWishlist(e, item._id)}>
                            {wishlist.includes(item._id) ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
                          </button>
                          {item.discount && item.discount > 0 && <span className="absolute top-2 left-2 badge badge-danger text-[10px]">-{item.discount}%</span>}
                          {!(item.quantity || 0) && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span></div>}
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{item.name}</h3>
                          <div className="flex items-center gap-1 mb-1.5">
                            <div className="flex">{stars(item.rating || 0)}</div>
                            <span className="text-[10px] text-gray-400">({item.reviewsCount || item.reviews || 0})</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mb-2.5">
                            <span className="text-sm font-black text-gray-900">₦{item.price.toLocaleString()}</span>
                            {item.originalPrice && <span className="text-[11px] text-gray-400 line-through">₦{item.originalPrice.toLocaleString()}</span>}
                          </div>
                          <button onClick={e => handleAddToCart(e, item)} disabled={!(item.quantity || 0)} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${(item.quantity || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            {(item.quantity || 0) ? <><FaShoppingCart className="text-[11px]" /> Add to Cart</> : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key={item._id} className="product-card flex cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                        <div className="relative w-40 sm:w-48 flex-shrink-0">
                          <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                          <div className="flex items-center gap-1 mb-2"><div className="flex">{stars(item.rating || 0)}</div><span className="text-xs text-gray-400">({item.reviewsCount || 0})</span></div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-black text-gray-900">₦{item.price.toLocaleString()}</span>
                            {item.originalPrice && <span className="text-sm text-gray-400 line-through">₦{item.originalPrice.toLocaleString()}</span>}
                            {item.discount && item.discount > 0 && <span className="badge badge-danger">{item.discount}% off</span>}
                          </div>
                          <button onClick={e => handleAddToCart(e, item)} disabled={!(item.quantity || 0)} className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${(item.quantity || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            <FaShoppingCart className="text-xs" /> {(item.quantity || 0) ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
