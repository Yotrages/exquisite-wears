import { useEffect, useState } from 'react'
import { apiClient } from '../Api/axiosConfig'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa'
import PageLoader from '../Components/PageLoader'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  category: string
  rating: number
  reviews: number
  discount?: number
  createdAt: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const authState = useSelector((state: any) => state.authSlice)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authState?.user?.isAdmin) {
      toast.error('Access denied')
      navigate('/admin')
      return
    }
    fetchProducts()
  }, [authState, navigate, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get(`/products/get?page=${page}&limit=20`)
      const prods = Array.isArray(data?.products) ? data.products : []
      setProducts(prods)
      setTotalPages(data?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return

    try {
      await apiClient.delete(`/products/delete/${id}`)
      toast.success('Product deleted')
      setProducts(products.filter(p => p._id !== id))
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <PageLoader message="Loading products..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <button
            onClick={() => navigate('/edit/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <input
            type="search"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Products Table */}
        {filteredProducts?.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">{product._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">₦{product.price.toLocaleString()}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${
                          product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">⭐ {product.rating?.toFixed(1) || 'N/A'}</p>
                          <p className="text-xs text-gray-500">({product.reviews} reviews)</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/edit/${product._id}`)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
