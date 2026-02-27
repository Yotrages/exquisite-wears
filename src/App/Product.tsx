import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FaShoppingCart, FaHeart, FaStar, FaShare, FaTruck,
  FaShieldAlt, FaArrowLeft, FaChevronRight, FaMinus,
  FaPlus, FaRegHeart, FaCheckCircle
} from 'react-icons/fa'
import { MdLocalOffer, MdVerified } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getAuthToken } from '../utils/cookieManager'
import apiClient from '../Api/axiosConfig';
import ProductImageGallery from '../Components/ProductImageGallery'
import ReviewSection from '../Components/ReviewSection'
import StarRating from '../Components/StarRating'
import RecommendedForYou from '../Components/RecommendedForYou'
import { addToRecentlyViewed } from '../Components/RecentlyViewed'
import { Product } from '../Types/Product'
import { setCart } from '../redux/cartSlice'
import Layout from '../Components/Layout'

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  useEffect(() => {
    if (id) { fetchProduct(id); fetchRelatedProducts(id); }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const { data } = await apiClient.get(`/products/get/${productId}`)
      const prod = data.product || data
      setProduct(prod)
      addToRecentlyViewed({ _id: prod._id, name: prod.name, price: prod.price, image: prod.image, discount: prod.discount })
      checkWishlistStatus(prod._id)
    } catch {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (productId: string) => {
    try {
      const { data } = await apiClient.get(`/products/${productId}/related`)
      setRelatedProducts((Array.isArray(data) ? data.slice(0, 6) : []))
    } catch { }
  }

  const checkWishlistStatus = async (productId: string) => {
    try {
      const { data: wishlist } = await apiClient.get('/wishlist')
      const arr = Array.isArray(wishlist.items) ? wishlist.items : []
      setIsInWishlist(arr.some((item: any) => item.product?._id === productId))
    } catch { }
  }

  const handleAddToCart = async () => {
    if (!product) return
    const token = getAuthToken()
    if (!token) { toast.error('Please log in first'); navigate('/login?redirect=/product/' + product._id); return; }
    setAddingToCart(true)
    try {
      const { data } = await apiClient.post('/cart/add', { productId: product._id, quantity })
      if (data?.cart?.items) {
        dispatch(setCart({ items: data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }))
      }
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    const token = getAuthToken()
    if (!token) { toast.error('Please log in first'); navigate('/login?redirect=/product/' + product._id); return; }
    // Navigate to checkout with only this product (buy-now flow)
    navigate('/checkout', {
      state: {
        buyNow: true,
        items: [{
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          stock: product.quantity || product.stock || 0
        }]
      }
    })
  }

  const handleToggleWishlist = async () => {
    if (!product) return
    try {
      if (isInWishlist) {
        await apiClient.delete(`/wishlist/product/${product._id}`)
        toast.success('Removed from wishlist')
      } else {
        await apiClient.post(`/wishlist/product/${product._id}`, { productId: product._id })
        toast.success('Added to wishlist!')
      }
      setIsInWishlist(!isInWishlist)
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

  const handleShare = async () => {
    if (!product) return
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url: window.location.href }) } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const deliveryEstimate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Legacy helper kept for seller rating only; products now use <StarRating />
  const starIcons = (r = 0, size = 'text-xs') => [1,2,3,4,5].map(s => (
    <FaStar key={s} className={`${size} ${s <= Math.round(r) ? 'text-amber-400' : 'text-gray-200'}`} />
  ))

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square shimmer rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 shimmer rounded w-3/4" />
              <div className="h-5 shimmer rounded w-1/2" />
              <div className="h-12 shimmer rounded w-1/3" />
              <div className="h-12 shimmer rounded" />
              <div className="h-12 shimmer rounded" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Product not found</h2>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </Layout>
    )
  }

  const discountedPrice = product.price
  const originalPrice = product.originalPrice || (product.discount ? Math.round(product.price / (1 - product.discount / 100)) : null)
  const savings = originalPrice ? originalPrice - discountedPrice : 0
  const galleryImages: string[] = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).filter((img: string) => img && img !== product.image && img.startsWith('http'))
  ]
  const inStock = (product.stock ?? product.quantity ?? 0) > 0
  const stockCount = product.stock ?? product.quantity ?? 0

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto scrollbar-hide">
              <Link to="/" className="hover:text-orange-500 transition-colors whitespace-nowrap">Home</Link>
              <FaChevronRight className="text-[10px] flex-shrink-0" />
              {product.category && (
                <>
                  <Link to={`/search/${product.category}`} className="hover:text-orange-500 transition-colors whitespace-nowrap">{product.category}</Link>
                  <FaChevronRight className="text-[10px] flex-shrink-0" />
                </>
              )}
              <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 mb-4 transition-colors">
            <FaArrowLeft className="text-xs" /> Back
          </button>

          {/* Main product section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image gallery */}
              <div className="p-5 bg-gray-50 border-r border-gray-100">
                <ProductImageGallery images={galleryImages} productName={product.name} />
              </div>

              {/* Product info */}
              <div className="p-5 lg:p-8 space-y-5">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                  {product.brand && (
                    <span className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-semibold">
                      <MdVerified className="text-orange-500" /> {product.brand}
                    </span>
                  )}
                  {/* {product.discount && product.discount > 0 && (
                    <span className="badge badge-danger">{product.discount}% OFF</span>
                  )} */}
                  {!inStock && (
                    <span className="badge bg-gray-200 text-gray-600">Out of Stock</span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating
                    rating={product.rating || product.averageRating || 0}
                    size="md"
                    showValue={(product.rating || product.averageRating || 0) > 0}
                    showCount={product.reviewsCount || product.totalReviews || 0}
                  />
                  {(product.reviewsCount || product.totalReviews || 0) > 50 && (
                    <span className="text-sm text-green-600 flex items-center gap-1"><FaCheckCircle className="text-xs" /> Popular item</span>
                  )}
                </div>

                {/* Price section */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      ₦{discountedPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-400 line-through">₦{originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                      <MdLocalOffer /> You save ₦{savings.toLocaleString()} ({product.discount}% off)
                    </p>
                  )}
                </div>

                {/* Stock status */}
                {inStock ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-sm text-green-700 font-semibold">In Stock</span>
                    {stockCount > 0 && stockCount <= 10 && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Only {stockCount} left!</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                  </div>
                )}

                {/* Quantity */}
                {inStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold border-x-2 border-gray-200 h-9 flex items-center justify-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => Math.min(stockCount, q + 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                        disabled={quantity >= stockCount}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!inStock || addingToCart}
                      className={`py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${inStock ? 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50' : 'border-2 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      {addingToCart ? (
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaShoppingCart className="text-sm" />
                      )}
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!inStock}
                      className={`py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${inStock ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleToggleWishlist}
                      className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border ${isInWishlist ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {isInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                      {isInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <FaShare /> Share
                    </button>
                  </div>
                </div>

                {/* Delivery & guarantees */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <FaTruck className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                      <p className="text-xs text-gray-500">Estimated delivery by <strong>{deliveryEstimate()}</strong></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaShieldAlt className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Buyer Protection</p>
                      <p className="text-xs text-gray-500">100% secure payment • 7-day easy returns</p>
                    </div>
                  </div>
                </div>

                {/* Seller info */}
                {product.seller && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {product.seller.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sold by {product.seller.name}</p>
                      <StarRating rating={product.seller.rating ?? 0} size="xs" showValue={(product.seller.rating ?? 0) > 0} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs: Description / Specs / Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
            {/* Tab nav */}
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
              {(['description', 'specs', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-orange-500 text-orange-500 bg-orange-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  {tab === 'reviews' ? `Reviews (${product.reviewsCount || product.totalReviews || 0})` : tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.description}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <div key={key} className={`flex justify-between py-2.5 px-3 rounded-lg text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-50'}`}>
                        <span className="text-gray-500 font-medium">{key}</span>
                        <span className="font-semibold text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No specifications available.</p>
                )
              )}

              {activeTab === 'reviews' && (
                <ReviewSection productId={product._id} />
              )}
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
              <div className="section-header mb-5">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Customers Also Viewed</h2>
                <button onClick={() => navigate('/search/all')} className="section-link">
                  See more <FaChevronRight className="text-xs" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {relatedProducts.map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} className="group">
                    <div className="border border-gray-100 rounded-xl p-3 hover:shadow-md transition-all hover:-translate-y-1">
                      <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">{p.name}</p>
                      <p className="text-sm font-black text-orange-500">₦{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More recommendations */}
          <RecommendedForYou />
        </div>
      </div>
    </Layout>
  )
}
