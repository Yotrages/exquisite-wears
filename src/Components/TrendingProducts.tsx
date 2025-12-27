import { useEffect, useState } from 'react';
import { apiClient } from '../Api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FaFire, FaStar } from 'react-icons/fa';
import { addItem } from '../redux/cartSlice';
import { Product } from '../Types/Product';
import { setCart } from '../redux/cartSlice';

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      // Try to get trending from recommendations API first
      const res = await apiClient.get('/products/get?limit=8&sort=popular');
      setProducts(res.data.products || res.data || []);
    } catch (error) {
      console.error('Failed to fetch trending products:', error);
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
      console.error('Failed to sync cart with server', err);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FaFire className="text-3xl text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
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
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaFire className="text-3xl text-orange-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <button
            onClick={() => navigate('/search/trending')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
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
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  TRENDING
                </div>
              </div>

              <div className="p-4">
                <h3
                  className="text-sm font-semibold text-gray-800 mb-1 truncate cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-orange-600">
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
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

export default TrendingProducts;
