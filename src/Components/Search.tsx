import { apiClient } from '../Api/axiosConfig';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch, FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaTh, FaList, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import { Product } from '../Types/Product';

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
  const token = authState?.token || null;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys'];

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
      setNewTerm(searchTerm);
    }
    fetchWishlist();
  }, [searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [data, priceRange, selectedCategories, minRating, sortBy, inStockOnly]);

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/wishlist');
      const ids = res.data.items?.map((item: any) => item.product._id) || [];
      setWishlistItems(ids);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const performSearch = async (term: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/products/search?query=${term}`);
      setData(res.data);
    } catch (error: any) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Price filter
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        item.category && selectedCategories.includes(item.category)
      );
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(item => 
        (item.rating || 0) >= minRating
      );
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(item => (item.quantity || 0) > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedCategories([]);
    setMinRating(0);
    setSortBy('relevance');
    setInStockOnly(false);
  };

  const toggleWishlist = async (productId: string) => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (wishlistItems.includes(productId)) {
        await apiClient.delete(`/wishlist/product/${productId}`);
        setWishlistItems(wishlistItems.filter(id => id !== productId));
      } else {
        await apiClient.post(
          `/wishlist/product/${productId}`,
          { productId }
        );
        setWishlistItems([...wishlistItems, productId]);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleAddToCart = async (item: Product) => {
    if (!token) {
      toast.error('Please log in first')
      navigate(`/login?redirect=/search/${searchTerm}`)
      return
    }

    dispatch(addItem({ id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
    try {
      const res = await apiClient.post(
        '/cart/add',
        { productId: item._id, quantity: 1 }
      );
      if (res.data?.cart?.items && Array.isArray(res.data.cart.items)) {
        const items = res.data.cart.items.map((it: any) => ({
          id: it.product._id || it.product,
          name: it.product.name,
          price: it.product.price,
          image: it.product.image,
          quantity: it.quantity,
          stock: it.product.quantity,
        }))
        dispatch(setCart({ items }));
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mt-20 py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results for "{searchTerm || newTerm}"
              </h1>
              <p className="text-gray-600">
                {filteredData.length} {filteredData.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {/* Mobile Search */}
            <div className="relative w-full lg:w-96">
              <input
                type="search"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch(newTerm)}
                className="w-full py-3 px-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Search products..."
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                onClick={() => performSearch(newTerm)}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between mt-6 pt-6 border-t">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaList />
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFilter />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                      <span className="text-gray-700 text-sm">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-4'
                }
              >
                {filteredData.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden ${
                      viewMode === 'list' ? 'flex' : 'flex flex-col'
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full h-48'}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => navigate(`/product/${item._id}`)}
                      />
                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                      >
                        {wishlistItems.includes(item._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 line-clamp-2"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        {item.name}
                      </h3>
                      
                      {viewMode === 'list' && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(item.rating || 0)}
                        <span className="text-xs text-gray-500">({item.reviews || 0})</span>
                      </div>

                      <div className="text-xl font-bold text-blue-600 mb-3">
                        ₦{item.price.toLocaleString()}
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={(item.quantity || 0) === 0}
                        className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors mt-auto ${
                          (item.quantity || 0) === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <FaShoppingCart />
                        {(item.quantity || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
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
