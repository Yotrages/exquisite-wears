import { useEffect, useState } from 'react';
import { apiClient } from '../Api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getAuthToken } from '../utils/cookieManager';
import { FaRobot, FaStar } from 'react-icons/fa';
import { addItem } from '../redux/cartSlice';
import { Product } from '../Types/Product';
import { setCart } from '../redux/cartSlice';

const RecommendedForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || getAuthToken();

  useEffect(() => {
    if (token) {
      fetchRecommendations();
    }
  }, [token]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/recommendations/for-you');
      setProducts((Array.isArray(res.data?.recommendations) ? res.data.recommendations : Array.isArray(res.data) ? res.data : []) || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback to regular products if recommendations fail
      try {
        const fallback = await apiClient.get('/products?limit=8');
        setProducts((Array.isArray(fallback.data?.products) ? fallback.data.products : Array.isArray(fallback.data) ? fallback.data : []) || []);
      } catch (err) {
        console.error('Fallback also failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!token) {
      toast.error('Please log in first')
      navigate(`/login?redirect=/`)
      return
    }

    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1 }));
    try {
      const res = await apiClient.post(
        '/cart/add',
        { productId: product._id, quantity: 1 }
      );
      if (res.data && res.data.cart && res.data.cart.items) {
        const items = res.data?.cart.items?.map((it: any) => ({
          id: it.product._id || it.product,
          name: it.product.name,
          price: it.product.price,
          originalPrice: it.product.originalPrice,
          discount: it.product.discount,
          image: it.product.image,
          quantity: it.quantity,
          stock: it.product.quantity,
        }));
        dispatch(setCart({ items }));
      }
    } catch (err) {
      console.error('Failed to sync cart with server', err);
    }
  };

  if (!token) return null;

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FaRobot className="text-3xl text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaRobot className="text-3xl text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Recommended For You</h2>
              <p className="text-sm text-gray-600 mt-1">AI-powered personalized picks just for you</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(Array.isArray(products) ? products.slice(0, 8) : []).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div
                className="relative cursor-pointer overflow-hidden"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <FaRobot className="text-xs" />
                  FOR YOU
                </div>
              </div>

              <div className="p-4">
                <h3
                  className="text-sm font-semibold text-gray-800 mb-1 truncate cursor-pointer hover:text-purple-600"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-purple-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold py-2 rounded-lg transition-all"
                >
                  Add to Cart
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
