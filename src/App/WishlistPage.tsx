import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { addItem, setCart } from '../redux/cartSlice';
import Layout from '../Components/Layout';
import { FaHeart, FaShoppingCart, FaStar, FaTrash } from 'react-icons/fa';

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const tokenToUse = getAuthToken();
    if (!tokenToUse) {
      navigate('/login');
      return;
    }

    try {
      const res = await apiClient.get('/wishlist');
      setWishlistItems(res.data.items || []);
    } catch (err: any) {
      console.error(err?.response?.data?.message || 'Failed to load wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const tokenToUse = getAuthToken();
    if (!tokenToUse) return;

    try {
      await apiClient.delete(`/wishlist/product/${productId}`);
      setWishlistItems(wishlistItems.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const addToCart = async (product: any) => {
    if (!token) {
      toast.error('Please log in first')
      navigate(`/login?redirect=/wishlist`)
      return
    }

    dispatch(addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }));

    try {
      const res = await apiClient.post(
        '/cart/add',
        { productId: product._id, quantity: 1 }
      );
      if (res.data && res.data.cart && res.data.cart.items) {
        const items = res.data.cart.items.map((it: any) => ({
          id: it.product._id || it.product,
          name: it.product.name,
          price: it.product.price,
          image: it.product.image,
          quantity: it.quantity,
          stock: it.product.quantity,
        }));
        dispatch(setCart({ items }));
      }
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const addAllToCart = async () => {
    for (const item of wishlistItems) {
      if (item.product.quantity > 0) {
        await addToCart(item.product);
      }
    }
    navigate('/cart');
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

  if (!wishlistItems.length && token) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaHeart className="text-3xl text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={addAllToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FaShoppingCart />
              Add All to Cart
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items here so you don't lose sight of them!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-56 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  />
                  {item.product.quantity === 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3
                    className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 line-clamp-2 min-h-[3rem]"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(item.product.rating || 0)}
                    <span className="text-xs text-gray-500">
                      ({item.product.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-xl font-bold text-blue-600 mb-3">
                    ₦{item.product.price.toLocaleString()}
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-gray-500 mb-3">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      addToCart(item.product);
                      removeFromWishlist(item.product._id);
                    }}
                    disabled={item.product.quantity === 0}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors mt-auto ${
                      item.product.quantity === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FaShoppingCart />
                    {item.product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Shopping */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;
