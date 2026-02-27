import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import Layout from '../Components/Layout';
import { FaHeart, FaShoppingCart, FaStar, FaTrash, FaChevronRight } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    description: string;
    quantity: number;
    rating?: number;
    reviews?: number;
  };
  addedAt: string;
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    const t = getAuthToken();
    if (!t) { navigate('/login'); return; }
    try {
      const res = await apiClient.get('/wishlist');
      setWishlistItems(res.data.items || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setRemoving(productId);
    try {
      await apiClient.delete(`/wishlist/product/${productId}`);
      setWishlistItems(w => w.filter(i => i.product._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
    finally { setRemoving(null); }
  };

  const addToCart = async (product: WishlistItem['product']) => {
    if (!token) { toast.error('Please log in first'); navigate('/login?redirect=/wishlist'); return; }
    setAddingToCart(product._id);
    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1, image: product.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: product._id, quantity: 1 });
      if (res.data?.cart?.items) {
        dispatch(setCart({ items: res.data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }));
      }
      toast.success('Added to cart!');
    } catch { }
    finally { setAddingToCart(null); }
  };

  const moveToCart = async (item: WishlistItem) => {
    await addToCart(item.product);
    await removeFromWishlist(item.product._id);
  };

  const addAllToCart = async () => {
    for (const item of wishlistItems) {
      if (item.product.quantity > 0) await addToCart(item.product);
    }
    navigate('/cart');
  };

  const stars = (r = 0) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => <FaStar key={s} className={`text-xs ${s <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'}`} />)}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 shimmer rounded mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-square shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-3 shimmer rounded" />
                  <div className="h-3 shimmer rounded w-2/3" />
                  <div className="h-8 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
            <button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">Home</button>
            <FaChevronRight className="text-[10px]" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaHeart className="text-2xl text-red-500" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>My Wishlist</h1>
                <p className="text-sm text-gray-500">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={addAllToCart}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
              >
                <FaShoppingCart className="text-sm" />
                Add All to Cart
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                <FaHeart className="text-4xl text-red-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                Save items you love to your wishlist. Review them anytime and easily add to cart.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all active:scale-95"
              >
                <HiOutlineShoppingBag className="text-lg" />
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Mobile add all */}
              <button
                onClick={addAllToCart}
                className="sm:hidden w-full mb-4 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                <FaShoppingCart /> Add All to Cart
              </button>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {wishlistItems.map((item) => (
                  <div key={item._id} className="product-card group">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={(
                          (item.product.image && (item.product.image.startsWith('http') || item.product.image.startsWith('/')) ? item.product.image : null) ||
                          ((item.product as any).images?.find?.((img: string) => img?.startsWith('http'))) ||
                          '/placeholder-product.jpg'
                        )}
                        alt={item.product.name}
                        className="product-img w-full h-full cursor-pointer"
                        onClick={() => navigate(`/product/${item.product._id}`)}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                      />

                      {/* Badges */}
                      {item.product.discount && item.product.discount > 0 && (
                        <span className="absolute top-2 left-2 badge badge-danger text-[10px]">-{item.product.discount}%</span>
                      )}
                      {item.product.quantity === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                        </div>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => removeFromWishlist(item.product._id)}
                        disabled={removing === item.product._id}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50"
                      >
                        {removing === item.product._id
                          ? <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          : <FaTrash className="text-red-500 text-xs" />}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3
                        className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-orange-500 transition-colors min-h-[2.5rem]"
                        onClick={() => navigate(`/product/${item.product._id}`)}
                      >
                        {item.product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1.5">
                        {stars(item.product.rating || 0)}
                        <span className="text-[10px] text-gray-400">({item.product.reviews || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-2.5">
                        <span className="text-sm font-black text-gray-900">₦{item.product.price.toLocaleString()}</span>
                        {item.product.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">₦{item.product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Move to cart */}
                      <button
                        onClick={() => moveToCart(item)}
                        disabled={item.product.quantity === 0 || addingToCart === item.product._id}
                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                          item.product.quantity === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {addingToCart === item.product._id
                          ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <FaShoppingCart className="text-[11px]" />}
                        {item.product.quantity === 0 ? 'Out of Stock' : 'Move to Cart'}
                      </button>

                      <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                        Saved {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <button onClick={() => navigate('/')} className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                  ← Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
