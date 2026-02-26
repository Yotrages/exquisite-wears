import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaTimes, FaArrowLeft, FaShoppingCart, FaCheck, FaChevronRight } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Product } from '../Types/Product'
import apiClient from '../Api/axiosConfig'
import Layout from '../Components/Layout'
import { addItem, setCart } from '../redux/cartSlice'

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const authState = useSelector((state: any) => state.authSlice)
  const token = authState?.token || null

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || []
    if (ids.length === 0) { navigate('/'); return; }
    fetchProducts(ids)
  }, [searchParams, navigate])

  const fetchProducts = async (ids: string[]) => {
    try {
      const results = await Promise.all(
        ids.map(id => apiClient.get(`/products/get/${id}`).then(res => res.data.product || res.data))
      )
      setProducts(results.filter(Boolean))
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (id: string) => {
    const updated = products.filter(p => p._id !== id).map(p => p._id).join(',')
    if (updated) navigate(`/compare?ids=${updated}`)
    else navigate('/')
  }

  const addToCart = async (product: Product) => {
    if (!token) { toast.error('Please log in first'); navigate(`/login?redirect=/product/${product._id}`); return; }
    dispatch(addItem({ id: product._id, name: product.name, price: product.price, quantity: 1, image: product.image }))
    try {
      const res = await apiClient.post('/cart/add', { productId: product._id, quantity: 1 })
      if (res.data?.cart?.items) {
        dispatch(setCart({ items: res.data.cart.items.map((it: any) => ({ id: it.product._id, name: it.product.name, price: it.product.price, image: it.product.image, quantity: it.quantity, stock: it.product.quantity })) }))
      }
      toast.success('Added to cart!')
    } catch { }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </Layout>
    )
  }

  if (products.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No products to compare</h2>
          <Link to="/" className="text-orange-500 hover:text-orange-600 font-semibold">Go back to shopping</Link>
        </div>
      </Layout>
    )
  }

  const rows = [
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Rating' },
    { key: 'brand', label: 'Brand', show: products.some(p => p.brand) },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Availability' },
    { key: 'discount', label: 'Discount', show: products.some(p => p.discount) },
    { key: 'description', label: 'Description' },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-gray-900 font-medium">Compare Products</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 font-semibold transition-colors">
                <FaArrowLeft className="text-xs" /> Back
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Compare Products</h1>
            </div>
            <span className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-left font-bold text-gray-600 text-sm sticky left-0 bg-gray-50 z-10 min-w-[120px] border-r border-gray-100">
                      Feature
                    </th>
                    {products.map(product => (
                      <th key={product._id} className="p-4 bg-gray-50 relative min-w-[220px] border-r border-gray-100 last:border-r-0">
                        <button
                          onClick={() => removeProduct(product._id)}
                          className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>

                        <div className="mb-3">
                          <img src={product.image || '/placeholder.jpg'} alt={product.name} className="w-full h-40 object-contain rounded-xl" />
                        </div>

                        <Link to={`/product/${product._id}`} className="font-bold text-sm text-gray-900 hover:text-orange-500 transition-colors block mb-3 line-clamp-2">
                          {product.name}
                        </Link>

                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <FaShoppingCart className="text-xs" /> Add to Cart
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.filter(r => r.show !== false).map((row, rowIdx) => (
                    <tr key={row.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className={`p-4 font-semibold text-sm text-gray-600 sticky left-0 z-10 border-r border-gray-100 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        {row.label}
                      </td>
                      {products.map(product => (
                        <td key={product._id} className="p-4 text-center border-r border-gray-100 last:border-r-0">
                          {row.key === 'price' && (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>₦{product.price.toLocaleString()}</span>
                              {product.discount && product.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">₦{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}</span>
                              )}
                            </div>
                          )}
                          {row.key === 'rating' && (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="text-amber-400">⭐</span>
                              <span className="font-bold text-gray-900">{product.averageRating?.toFixed(1) || 'N/A'}</span>
                              <span className="text-xs text-gray-400">/5</span>
                            </div>
                          )}
                          {row.key === 'brand' && <span className="text-sm text-gray-700 font-medium">{product.brand || '—'}</span>}
                          {row.key === 'category' && <span className="text-sm text-gray-700">{product.category || '—'}</span>}
                          {row.key === 'stock' && (
                            (product.stock && product.stock > 0)
                              ? <span className="inline-flex items-center gap-1.5 text-green-700 text-sm font-semibold"><FaCheck className="text-green-500" /> In Stock</span>
                              : <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
                          )}
                          {row.key === 'discount' && (
                            product.discount
                              ? <span className="inline-block bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{product.discount}% OFF</span>
                              : <span className="text-gray-400 text-sm">—</span>
                          )}
                          {row.key === 'description' && <p className="text-xs text-gray-600 line-clamp-3 text-left">{product.description || '—'}</p>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all">
              Continue Shopping
            </Link>
            <button
              onClick={() => { products.forEach(p => addToCart(p)); navigate('/cart'); }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <FaShoppingCart /> Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
