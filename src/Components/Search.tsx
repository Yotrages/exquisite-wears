import { apiClient } from '../Api/axiosConfig';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaSearch, FaStar, FaHeart, FaRegHeart, FaShoppingCart,
  FaTh, FaList, FaFilter, FaChevronDown, FaTimes, FaChevronRight
} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import { Product } from '../Types/Product';

// Terms that are categories / special routes, not product names
const CATEGORY_TERMS = [
  'fashion', 'electronics', 'phones', 'home', 'books', 'baby', 'sports',
  'health', 'jewellery', 'kitchen', 'cameras', 'food', 'beauty', 'toys',
  'all', 'trending', 'new arrivals', 'flash sales', 'flash deals',
  'deals', 'offers', 'sale'
];

const SPECIAL_TERM_MAP: Record<string, { type: 'category' | 'special'; value?: string }> = {
  'flash sales': { type: 'special', value: 'flash' },
  'flash deals': { type: 'special', value: 'flash' },
  'deals': { type: 'special', value: 'flash' },
  'all': { type: 'special', value: 'all' },
  'trending': { type: 'special', value: 'trending' },
  'new arrivals': { type: 'special', value: 'newest' },
  'offers': { type: 'special', value: 'flash' },
  'sale': { type: 'special', value: 'flash' },
};

const Search = () => {
  const { searchTerm } = useParams();
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [newTerm, setNewTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<'text' | 'category' | 'all' | 'flash' | 'trending' | 'newest'>('text');

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Books', 'Toys', 'Health', 'Phones', 'Kitchen'];

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setNewTerm(searchTerm);
      const specialEntry = SPECIAL_TERM_MAP[term];
      if (specialEntry) {
        setSearchMode(specialEntry.value as any);
        performSpecialSearch(specialEntry.value as any);
      } else if (CATEGORY_TERMS.includes(term)) {
        setSearchMode('category');
        performCategorySearch(searchTerm);
      } else {
        setSearchMode('text');
        performSearch(searchTerm);
      }
    }
    if (token) {
      apiClient.get('/wishlist').then(r => {
        setWishlistItems((r.data.items || []).map((i: any) => i.product?._id).filter(Boolean));
      }).catch(() => {});
    }
  }, [searchTerm]);

  useEffect(() => { applyFilters(); }, [data, priceRange, selectedCategories, minRating, sortBy, inStockOnly]);

  const performSearch = async (term: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/products/search?query=${encodeURIComponent(term)}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const performCategorySearch = async (category: string) => {
    setLoading(true);
    try {
      // Use advanced search with category filter
      const res = await apiClient.get(`/search?categories=${encodeURIComponent(category)}&limit=50`);
      setData(res.data?.products || []);
    } catch {
      // Fallback to simple search with category
      try {
        const res = await apiClient.get(`/products/search?query=${encodeURIComponent(category)}`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const performSpecialSearch = async (type: string) => {
    setLoading(true);
    try {
      if (type === 'flash') {
        const res = await apiClient.get('/products/flash-deals');
        setData(Array.isArray(res.data) ? res.data : []);
      } else if (type === 'trending') {
        const res = await apiClient.get('/products/trending');
        setData(Array.isArray(res.data) ? res.data : []);
      } else if (type === 'newest') {
        const res = await apiClient.get('/search?sortBy=newest&limit=50');
        setData(res.data?.products || []);
      } else {
        // 'all' - get all products
        const res = await apiClient.get('/products/get?limit=100');
        setData(res.data?.products || []);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let f = [...data]
      .filter(i => i.price >= priceRange[0] && i.price <= priceRange[1])
      .filter(i => !selectedCategories.length || (i.category && selectedCategories.includes(i.category)))
      .filter(i => !minRating || (i.rating || 0) >= minRating)
      .filter(i => !inStockOnly || (i.quantity || 0) > 0);
    if (sortBy === 'price-low') f.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') f.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') f.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'newest') f.reverse();
    setFilteredData(f);
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    navigate(`/search/${encodeURIComponent(term)}`);
  };

  const toggleCategory = (cat: string) =>
    setSelectedCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);

  const clearFilters = () => {
    setPriceRange([0, 1000000]); setSelectedCategories([]); setMinRating(0);
    setSortBy('relevance'); setInStockOnly(false);
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    try {
      if (wishlistItems.includes(productId)) {
        await apiClient.delete(`/wishlist/product/${productId}`);
        setWishlistItems(w => w.filter(id => id !== productId));
      } else {
        await apiClient.post(`/wishlist/product/${productId}`, { productId });
        setWishlistItems(w => [...w, productId]);
        toast.success('Added to wishlist!');
      }
    } catch { }
  };

  const handleAddToCart = async (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    if (!token) { toast.error('Please log in first'); navigate(`/login?redirect=/search/${searchTerm}`); return; }
    dispatch(addItem({ id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: item._id, quantity: 1 });
      if (res.data?.cart?.items) dispatch(setCart({ items: res.data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }));
    } catch { }
    toast.success('Added to cart!');
  };

  const getImageSrc = (item: Product) => {
    if (item.image) return item.image;
    if (item.images && item.images.length > 0) return item.images[0];
    return '/placeholder-product.jpg';
  };

  const stars = (r = 0) => [1,2,3,4,5].map(s => (
    <FaStar key={s} className={`text-xs ${s <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'}`} />
  ));

  const activeFiltersCount = selectedCategories.length + (minRating ? 1 : 0) + (inStockOnly ? 1 : 0) + (priceRange[1] < 1000000 ? 1 : 0);

  const getPageTitle = () => {
    if (!searchTerm) return 'All Products';
    const term = searchTerm.toLowerCase();
    if (term === 'flash sales' || term === 'flash deals' || term === 'deals') return '⚡ Flash Sales';
    if (term === 'trending') return '🔥 Trending Products';
    if (term === 'new arrivals') return '✨ New Arrivals';
    if (term === 'all') return 'All Products';
    return `"${searchTerm}"`;
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">Home</button>
          <FaChevronRight className="text-[10px]" />
          <span className="text-gray-900 font-medium">
            {searchMode === 'category' ? `Category: ${searchTerm}` : `Search: ${searchTerm}`}
          </span>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-orange-500">{getPageTitle()}</span>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredData.length} product{filteredData.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <input
                type="search"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(newTerm)}
                className="w-full py-2.5 px-4 pr-10 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm"
                placeholder="Search products..."
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                onClick={() => handleSearch(newTerm)}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all border lg:hidden ${showFilters ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'}`}
              >
                <FaFilter className="text-xs" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-orange-500 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFiltersCount}</span>
                )}
              </button>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <FaList className="text-sm" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-60 flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-sm">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-semibold">Clear all ({activeFiltersCount})</button>
                  )}
                  <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setShowFilters(false)}>
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Price Range</h3>
                <input
                  type="range" min="0" max="1000000" step="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, +e.target.value])}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₦0</span>
                  <span className="font-semibold text-gray-900">₦{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox" checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-3.5 h-3.5 accent-orange-500 rounded"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Min Rating</h3>
                {[4,3,2,1].map(r => (
                  <label key={r} className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-orange-500" />
                    <div className="flex items-center gap-1">
                      <div className="flex">{stars(r)}</div>
                      <span className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors">& up</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-3.5 h-3.5 accent-orange-500 rounded" />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={viewMode === 'grid' ? 'product-grid-wide' : 'space-y-3'}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`bg-white rounded-xl overflow-hidden ${viewMode === 'list' ? 'flex h-32' : ''}`}>
                    <div className={`shimmer ${viewMode === 'list' ? 'w-32 h-full flex-shrink-0' : 'aspect-square'}`} />
                    <div className="p-3 space-y-2 flex-1">
                      <div className="h-3 shimmer rounded w-3/4" />
                      <div className="h-3 shimmer rounded w-1/2" />
                      <div className="h-8 shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>No products found</h3>
                <p className="text-gray-500 mb-6 text-sm">Try adjusting your search or filters</p>
                <div className="flex items-center justify-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="px-6 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                      Clear Filters
                    </button>
                  )}
                  <button onClick={() => navigate('/')} className="px-6 py-2.5 border border-orange-500 text-orange-500 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'product-grid-wide' : 'space-y-3'}>
                {filteredData.map((item) => (
                  viewMode === 'grid' ? (
                    <div key={item._id} className="product-card" onClick={() => navigate(`/product/${item._id}`)}>
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img src={getImageSrc(item)} alt={item.name} className="product-img w-full h-full"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                        <button
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                          onClick={(e) => toggleWishlist(e, item._id)}
                        >
                          {wishlistItems.includes(item._id) ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
                        </button>
                        {item.discount && item.discount > 0 && <span className="absolute top-2 left-2 badge badge-danger text-[10px]">-{item.discount}%</span>}
                        {!(item.quantity || 0) && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span></div>}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">{item.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">{stars(item.rating || 0)}</div>
                          <span className="text-[10px] text-gray-400">({item.reviewsCount || item.reviews || 0})</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-2.5">
                          <span className="text-sm font-black text-gray-900">₦{item.price.toLocaleString()}</span>
                          {item.originalPrice && <span className="text-[11px] text-gray-400 line-through">₦{item.originalPrice.toLocaleString()}</span>}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, item)}
                          disabled={!(item.quantity || 0)}
                          className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${(item.quantity || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          {(item.quantity || 0) ? <><FaShoppingCart className="text-[11px]" /> Add to Cart</> : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={item._id} className="product-card flex" onClick={() => navigate(`/product/${item._id}`)}>
                      <div className="relative w-40 sm:w-48 flex-shrink-0">
                        <img src={getImageSrc(item)} alt={item.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                        <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center" onClick={(e) => toggleWishlist(e, item._id)}>
                          {wishlistItems.includes(item._id) ? <FaHeart className="text-red-500 text-xs" /> : <FaRegHeart className="text-gray-400 text-xs" />}
                        </button>
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-1 mb-2"><div className="flex">{stars(item.rating || 0)}</div><span className="text-xs text-gray-400">({item.reviewsCount || item.reviews || 0})</span></div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-gray-900">₦{item.price.toLocaleString()}</span>
                          {item.originalPrice && <span className="text-sm text-gray-400 line-through">₦{item.originalPrice.toLocaleString()}</span>}
                          {item.discount && item.discount > 0 && <span className="badge badge-danger">{item.discount}% off</span>}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, item)}
                          disabled={!(item.quantity || 0)}
                          className={`mt-3 px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${(item.quantity || 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          <FaShoppingCart className="text-xs" />
                          {(item.quantity || 0) ? 'Add to Cart' : 'Out of Stock'}
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
    </section>
  );
};

export default Search;
