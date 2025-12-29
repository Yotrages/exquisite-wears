import useProductValidator from "../Api/ProductValidator";
import { MessageRight } from "./Message";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { addItem, setCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { rootState } from "../redux/store";

const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col h-fit rounded-lg bg-gray-200 overflow-hidden">
    <div className="w-full h-[200px] bg-gray-300"></div>
    <div className="flex flex-col gap-2 p-4">
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      <div className="h-4 bg-gray-400 rounded w-1/2"></div>
      <div className="h-8 bg-gray-400 rounded w-full mt-2"></div>
    </div>
  </div>
);

const Feeds = () => {
  const {
    handleEdit,
    deletePost,
    success,
    products,
    error,
    setCurrentPage,
    currentPage,
    totalPages,
  } = useProductValidator();

  const isLoading = products.length === 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: rootState) => state.authSlice);
  const token = authState?.token || null;

  const [show, setShow] = useState(false);
  const [image, setImage] = useState<string | undefined>("");
  const [images, setImages] = useState<string[] | undefined>(undefined);
  const [name, setName] = useState<string | undefined>("");
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>("");
  const [selectedProductRating, setSelectedProductRating] = useState<number>(0);
  const [selectedProductReviews, setSelectedProductReviews] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loadingCart, setLoadingCart] = useState<string | null>(null);

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

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

  const toggleWishlist = async (productId: string) => {
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

  const handleAddToCart = async (item: any) => {
    if (!token) {
      toast.error('Please log in first')
      navigate(`/login?redirect=/`)
      return
    }

    setLoadingCart(item._id);
    // optimistic update
    dispatch(addItem({ id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
    
    try {
      const res = await apiClient.post(
        '/cart/add',
        { productId: item._id, quantity: 1 }
      );
      if (res.data && res.data.cart && res.data.cart.items) {
        const items = res.data.cart.items.map((it: any) => ({
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
    setLoadingCart(null);
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
    <section className="py-12 bg-gray-50">
      <Modal
        name={name}
        setShow={setShow}
        show={show}
        image={image}
        images={images}
        productId={selectedProductId}
        productRating={selectedProductRating}
        totalReviews={selectedProductReviews}
      />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading
            ? Array(10)
                .fill(0)
                .map((_, index) => <SkeletonCard key={index} />)
            : products.map((item) => (
                <div
                  key={item?._id}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      className="w-full h-48 sm:h-56 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                      src={item?.image}
                      alt={item?.name}
                      onClick={() => navigate(`/product/${item?._id}`)}
                      loading="lazy"
                    />
                    
                    {/* Stock Badge */}
                    {item.quantity === 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                    
                    {/* Discount Badge - if applicable */}
                    {item?.originalPrice && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                        title={wishlistItems.includes(item._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {wishlistItems.includes(item._id) ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-600 text-lg" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setShow(true);
                          setImages(item?.images || (item?.image ? [item.image] : []));
                          setImage(item?.image);
                          setName(item?.name);
                          setSelectedProductId(item?._id);
                          setSelectedProductRating(item?.rating || 0);
                          setSelectedProductReviews(item?.reviews || 0);
                        }}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors"
                        title="Quick View"
                      >
                        <FaEye className="text-gray-600 text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3
                      className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 mb-2 min-h-[2.5rem]"
                      onClick={() => navigate(`/product/${item?._id}`)}
                    >
                      {item?.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(item?.rating || 0)}
                      <span className="text-xs text-gray-500">
                        ({item?.reviews || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="text-lg font-bold text-blue-600">
                        ₦{item.price?.toLocaleString()}
                      </div>
                      {item.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₦{item.originalPrice?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.quantity === 0 || loadingCart === item._id}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-auto ${
                        item.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {loadingCart === item._id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaShoppingCart />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Admin Actions */}
                    {token && authState?.user?.isAdmin && (
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(item._id)}
                          className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white text-xs rounded-lg font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePost(item._id)}
                          className="flex-1 py-2 px-3 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-row w-full items-center justify-center pt-8 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = currentPage <= 3 
                ? idx + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + idx 
                  : currentPage - 2 + idx;
              
              if (pageNum < 1 || pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Feeds;
