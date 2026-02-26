import useProductValidator from "../Api/ProductValidator";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { addItem, setCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaEye, FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { rootState } from "../redux/store";

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded" />
    </div>
  </div>
);

const Feeds = () => {
  const {
    handleEdit,
    deletePost,
    products,
    setCurrentPage,
    currentPage,
    totalPages,
  } = useProductValidator();

  const isLoading = products?.length === 0;
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

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/wishlist');
      const ids = res.data.items?.map((item: any) => item.product._id) || [];
      setWishlistItems(ids);
    } catch { }
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!token) { navigate('/login'); return; }
    try {
      if (wishlistItems.includes(productId)) {
        await apiClient.delete(`/wishlist/product/${productId}`);
        setWishlistItems(wishlistItems.filter(id => id !== productId));
      } else {
        await apiClient.post(`/wishlist/product/${productId}`, { productId });
        setWishlistItems([...wishlistItems, productId]);
      }
    } catch { }
  };

  const handleAddToCart = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Please log in first');
      navigate(`/login?redirect=/`);
      return;
    }
    setLoadingCart(item._id);
    dispatch(addItem({ id: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
    try {
      const res = await apiClient.post('/cart/add', { productId: item._id, quantity: 1 });
      if (res.data?.cart?.items && Array.isArray(res.data.cart.items)) {
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
      toast.success('Added to cart!');
    } catch { }
    setLoadingCart(null);
  };

  const pageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <section className="py-10 bg-white">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="section-header mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-orange-500" />
            <FaFire className="text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              All Products
            </h2>
            {!isLoading && products.length > 0 && (
              <span className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
            )}
          </div>
          <button onClick={() => navigate('/search/all')} className="section-link text-sm">
            See all <FaChevronRight className="text-xs" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {isLoading
            ? Array(10).fill(0).map((_, index) => <SkeletonCard key={index} />)
            : (Array.isArray(products) ? products : []).map((item) => (
              <div
                key={item._id}
                className="product-card group cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    className="product-img w-full h-full"
                    src={item.image || item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                  />

                  {/* Badges */}
                  {item.quantity === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-lg">Out of Stock</span>
                    </div>
                  )}
                  {item.discount && item.discount > 0 && item.quantity > 0 && (
                    <span className="absolute top-2 left-2 badge badge-danger text-[10px]">-{item.discount}%</span>
                  )}
                  {!item.discount && item.originalPrice && item.quantity > 0 && (
                    <span className="absolute top-2 left-2 badge badge-danger text-[10px]">
                      -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </span>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => toggleWishlist(e, item._id)}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      {wishlistItems.includes(item._id)
                        ? <FaHeart className="text-red-500 text-sm" />
                        : <FaRegHeart className="text-gray-500 text-sm" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShow(true);
                        setImages(item.images || (item.image ? [item.image] : []));
                        setImage(item.image);
                        setName(item.name);
                        setSelectedProductId(item._id);
                        setSelectedProductRating(item.rating || 0);
                        setSelectedProductReviews(item.reviews || 0);
                      }}
                      className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors"
                    >
                      <FaEye className="text-gray-500 text-sm" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem] group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} className={`text-[10px] ${s <= Math.round(item.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">({item.reviews || 0})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-sm font-black text-gray-900">₦{item.price?.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through">₦{item.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    disabled={item.quantity === 0 || loadingCart === item._id}
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                      item.quantity === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {loadingCart === item._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : item.quantity === 0 ? 'Out of Stock' : (
                      <><FaShoppingCart className="text-[11px]" /> Add to Cart</>
                    )}
                  </button>

                  {/* Admin Actions */}
                  {token && authState?.user?.isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleEdit(item._id); }}
                        className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs rounded-lg font-semibold transition-colors"
                      >Edit</button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deletePost(item._id); }}
                        className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-semibold transition-colors"
                      >Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-xs text-gray-500" />
            </button>

            {currentPage > 3 && (
              <>
                <button onClick={() => setCurrentPage(1)} className="w-9 h-9 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all">1</button>
                {currentPage > 4 && <span className="text-gray-400 text-sm px-1">…</span>}
              </>
            )}

            {pageNumbers().map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === num
                    ? 'bg-orange-500 text-white border border-orange-500 shadow-md'
                    : 'border border-gray-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                {num}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="text-gray-400 text-sm px-1">…</span>}
                <button onClick={() => setCurrentPage(totalPages)} className="w-9 h-9 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all">{totalPages}</button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="text-xs text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Feeds;
