import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHistory } from 'react-icons/fa'
import { Product } from '../Types/Product'

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed')
    if (viewed) {
      try {
        const parsedProducts = JSON.parse(viewed)
        setProducts(parsedProducts.slice(0, 6)) // Show max 6 products
      } catch (error) {
        console.error('Error parsing recently viewed products:', error)
        localStorage.removeItem('recentlyViewed')
      }
    }
  }, [])

  if (products?.length === 0) return null

  return (
    <section className="py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-2xl text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Recently Viewed</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {(products || []).map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group"
          >
            <div className="border border-gray-200 rounded-lg p-3 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-gray-50">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Discount Badge */}
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <p className="text-green-600 font-bold text-lg">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.discount && product.discount > 0 && (
                    <p className="text-gray-400 line-through text-sm">
                      ₦{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* View Again Hint */}
              <div className="mt-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                View again →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Clear History Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            localStorage.removeItem('recentlyViewed')
            setProducts([])
          }}
          className="text-sm text-gray-600 hover:text-red-600 underline transition-colors"
        >
          Clear History
        </button>
      </div>
    </section>
  )
}

// Helper function to add product to recently viewed
// Call this function on product page load
export function addToRecentlyViewed(product: Product) {
  try {
    const viewed = localStorage.getItem('recentlyViewed')
    let products: Product[] = viewed ? JSON.parse(viewed) : []
    
    // Remove if already exists (to move to front)
    products = products.filter(p => p._id !== product._id)
    
    // Add to front
    products.unshift(product)
    
    // Keep only last 10
    products = products.slice(0, 10)
    
    localStorage.setItem('recentlyViewed', JSON.stringify(products))
  } catch (error) {
    console.error('Error adding to recently viewed:', error)
  }
}
