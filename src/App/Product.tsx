import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaShare, 
  FaTruck, 
  FaShieldAlt,
  FaArrowLeft,
  FaChevronRight
} from 'react-icons/fa'
// @ts-ignore: react-hot-toast types may not be installed
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getAuthToken } from '../utils/cookieManager'
import apiClient from '../Api/axiosConfig';
import ProductImageGallery from '../Components/ProductImageGallery'
import ReviewSection from '../Components/ReviewSection'
import RecommendedForYou from '../Components/RecommendedForYou'
import { addToRecentlyViewed } from '../Components/RecentlyViewed'
import { Product } from '../Types/Product'

import { setCart } from '../redux/cartSlice'
export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, _setSelectedSize] = useState('')
  const [selectedColor, _setSelectedColor] = useState('')
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  


  useEffect(() => {
    if (id) {
      fetchProduct(id)
      fetchRelatedProducts(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const { data } = await apiClient.get(`/products/get/${productId}`)
      const prod = data.product || data; // support both shapes
      setProduct(prod)
        
      // Add to recently viewed
      addToRecentlyViewed({
        _id: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        discount: prod.discount
      })
        
      // Check if in wishlist
      checkWishlistStatus(prod._id)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (productId: string) => {
    try {
      const { data } = await apiClient.get(`/products/${productId}/related`)
      setRelatedProducts((Array.isArray(data) ? data.slice(0, 6) : []) || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const checkWishlistStatus = async (productId: string) => {
    try {
      const { data: wishlist } = await apiClient.get('/wishlist')
      const wishlistArray = Array.isArray(wishlist) ? wishlist : []
      setIsInWishlist(wishlistArray.some((item: any) => item._id === productId))
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Check if user is logged in
    const token = getAuthToken() || null
    if (!token) {
      toast.error('Please log in first')
      navigate('/login?redirect=/product/' + product._id)
      return
    }

    try {
      const { data } = await apiClient.post('/cart/add', {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor
      })

      if (data?.cart?.items && Array.isArray(data.cart.items)) {
        const items = data.cart.items.map((it: any) => ({
          id: it.product._id || it.product,
          name: it.product.name,
          price: it.product.price,
          image: it.product.image,
          quantity: it.quantity,
          stock: it.product.quantity,
        }))
        // update redux
        dispatch(setCart({ items }))
      }

      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleToggleWishlist = async () => {
    if (!product) return

    try {
      if (isInWishlist) {
        await apiClient.delete(`/wishlist/product/${product._id}`, { data: { productId: product._id } })
      } else {
        await apiClient.post(`/wishlist/product/${product._id}`, { productId: product._id })
      }
      setIsInWishlist(!isInWishlist)
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
    } catch (error) {
      toast.error('Failed to update wishlist')
    }
  }

  const handleShare = async () => {
    if (!product) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const getDeliveryEstimate = () => {
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 3) // 3 days delivery
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to homepage
        </Link>
      </div>
    )
  }

  const displayedPrice = product.price
  const originalPriceDisplay = product.originalPrice || (product.discount ? Math.round((product.price / (1 - (product.discount/100))) * 100) / 100 : null)

  const galleryImages: string[] = Array.isArray(product.images) ? product.images.filter((img: any): img is string => Boolean(img)) : (product.image ? [product.image as string] : []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <FaChevronRight className="text-xs" />
            <Link to={`/category/${product.category}`} className="hover:text-blue-600">
              {product.category}
            </Link>
            <FaChevronRight className="text-xs" />
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Product Main Section */}
        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6 mb-8">
                  {/* Image Gallery */}
          <ProductImageGallery images={galleryImages} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-600">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}
            </div>

            {/* Seller & Specifications */}
            {product.seller && (
              <div className="border-t pt-4">
                <h3 className="font-semibold">Sold by</h3>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">{product.seller.name?.charAt(0)}</div>
                  <div>
                    <div className="font-semibold">{product.seller.name}</div>
                    <div className="text-sm text-gray-500">{(product.seller.rating ?? 0).toFixed(1)} ★</div>
                  </div>
                </div>
              </div>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Specifications</h3>
                <ul className="text-sm text-gray-700 grid grid-cols-2 gap-2">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium">{String(v)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.floor(product?.averageRating || 0) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.averageRating !== undefined ? product.averageRating.toFixed(1) : 'N/A'} ({product.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-green-600">
                  ₦{displayedPrice.toLocaleString()}
                </span>
                {originalPriceDisplay && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₦{originalPriceDisplay.toLocaleString()}
                    </span>
                    {product.discount && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
              {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 && (
                <p className="text-orange-600 text-sm mt-2">
                  Only {product.stock ?? 0} left in stock!
                </p>
              )}
            </div>

            {/* Size/Color Selectors (if applicable) */}
            {/* Add your size/color selector logic here */}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-10 text-center border rounded-lg"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product?.stock ?? Number.MAX_SAFE_INTEGER, quantity + 1))}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 disabled:bg-gray-400 transition-colors"
              >
                <FaShoppingCart />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleToggleWishlist}
                  className={`py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isInWishlist
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaHeart className={isInWishlist ? 'fill-current' : ''} />
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>

                <button
                  onClick={handleShare}
                  className="bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <FaShare />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery & Return Info */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-start gap-3">
                <FaTruck className="text-green-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <p className="text-sm text-gray-600">
                    Delivery by {getDeliveryEstimate()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-blue-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold">Secure Payment & 7-Day Returns</p>
                  <p className="text-sm text-gray-600">
                    Your payment information is protected
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Sold by</p>
                <p className="font-semibold">{product.seller.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(product.seller?.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}
                        size={12}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {(product.seller.rating ?? 0)}/5
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Description & Specifications */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-3">Specifications</h3>
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 font-semibold">{key}</td>
                      <td className="py-2 px-4">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reviews */}
        <ReviewSection productId={product._id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Customers Also Bought</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(relatedProducts || []).map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="group"
                >
                  <div className="border rounded-lg p-4 hover:shadow-lg transition">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-green-600 font-bold">
                      ₦{relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More Recommendations */}
        <div className="mt-12">
          <RecommendedForYou />
        </div>
      </div>
    </div>
  )
}
