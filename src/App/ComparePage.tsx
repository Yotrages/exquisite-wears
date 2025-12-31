import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaTimes, FaArrowLeft, FaShoppingCart, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Product } from '../Types/Product'
import apiClient from '../Api/axiosConfig'

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const authState = useSelector((state: any) => state.authSlice)
  const token = authState?.token || null

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || []
    if (ids.length === 0) {
      navigate('/')
      return
    }
    fetchProducts(ids)
  }, [searchParams, navigate])

  const fetchProducts = async (ids: string[]) => {
    try {
      const promises = ids?.map(id =>
        apiClient.get(`/api/products/get/${id}`).then(res => res.data.product || res.data)
      )
      const results = await Promise.all(promises)
      setProducts(results.filter(p => p))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (id: string) => {
    const updatedIds = products
      .filter(p => p._id !== id)
      ?.map(p => p._id)
      .join(',')
    
    if (updatedIds) {
      navigate(`/compare?ids=${updatedIds}`)
    } else {
      navigate('/')
    }
  }

  const addToCart = async (product: Product) => {
    if (!token) {
      toast.error('Please log in first')
      navigate(`/login?redirect=/product/${product._id}`)
      return
    }

    try {
      await apiClient.post('/api/cart', {
        productId: product._id,
        quantity: product.quantity
      })

      toast.success('Added to cart!')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No products to compare</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to shopping
        </Link>
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft />
            Back
          </button>
          <h1 className="text-3xl font-bold">Compare Products</h1>
        </div>
        
        <p className="text-gray-600">
          Comparing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg -mx-4 xs:mx-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 xs:p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[120px] text-xs xs:text-sm">
                Feature
              </th>
              {products?.map((product) => (
                <th key={product._id} className="border p-2 xs:p-4 bg-gray-50 relative min-w-[200px] xs:min-w-[250px]">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                    title="Remove from comparison"
                  >
                    <FaTimes />
                  </button>

                  {/* Product Image */}
                  <div className="mb-4">
                    <img
                      src={product.image || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Name */}
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline block mb-2"
                  >
                    {product.name}
                  </Link>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price Row */}
            <tr>
              <td className="border p-4 font-semibold bg-gray-50 sticky left-0 z-10">
                Price
              </td>
              {products?.map((product) => (
                <td key={product._id} className="border p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-green-600">
                      ₦{product.price.toLocaleString()}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₦{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="bg-gray-50">
              <td className="border p-4 font-semibold sticky left-0 bg-gray-50 z-10">
                Rating
              </td>
              {products?.map((product) => (
                <td key={product._id} className="border p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-bold">
                      {product.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-gray-500">/5</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Brand Row */}
            {products.some(p => p.brand) && (
              <tr>
                <td className="border p-4 font-semibold bg-gray-50 sticky left-0 z-10">
                  Brand
                </td>
                {products?.map((product) => (
                  <td key={product._id} className="border p-4 text-center">
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>
            )}

            {/* Category Row */}
            <tr className="bg-gray-50">
              <td className="border p-4 font-semibold sticky left-0 bg-gray-50 z-10">
                Category
              </td>
              {products?.map((product) => (
                <td key={product._id} className="border p-4 text-center">
                  {product.category || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Stock Row */}
            <tr>
              <td className="border p-4 font-semibold bg-gray-50 sticky left-0 z-10">
                Availability
              </td>
              {products?.map((product) => (
                <td key={product._id} className="border p-4 text-center">
                  {product.stock && product.stock > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <FaCheck />
                      <span>In Stock ({product.stock})</span>
                    </div>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Discount Row */}
            {products.some(p => p.discount) && (
              <tr className="bg-gray-50">
                <td className="border p-4 font-semibold sticky left-0 bg-gray-50 z-10">
                  Discount
                </td>
                {products?.map((product) => (
                  <td key={product._id} className="border p-4 text-center">
                    {product.discount ? (
                      <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                        {product.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-gray-500">No discount</span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Description Row */}
            <tr>
              <td className="border p-4 font-semibold bg-gray-50 sticky left-0 z-10">
                Description
              </td>
              {products?.map((product) => (
                <td key={product._id} className="border p-4">
                  <p className="text-sm text-gray-700 line-clamp-4">
                    {product.description || 'No description available'}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
        <button
          onClick={() => {
            products.forEach(p => addToCart(p))
            navigate('/cart')
          }}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <FaShoppingCart />
          Add All to Cart
        </button>
      </div>
    </div>
  )
}
