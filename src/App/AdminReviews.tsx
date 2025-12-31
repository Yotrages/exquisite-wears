import { useEffect, useState } from 'react'
import { apiClient } from '../Api/axiosConfig'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaStar, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import PageLoader from '../Components/PageLoader'

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  product: {
    _id: string
    name: string
  }
  rating: number
  title: string
  comment: string
  status: 'approved' | 'pending' | 'rejected'
  isVerifiedPurchase: boolean
  createdAt: string
  helpfulCount: number
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const authState = useSelector((state: any) => state.authSlice)
  const navigate = useNavigate()

  // Protect admin route
  useEffect(() => {
    if (!authState?.user?.isAdmin) {
      toast.error('Access denied')
      navigate('/admin')
      return
    }
    fetchReviews()
  }, [authState, navigate, filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/reviews')
      const allReviews = Array.isArray(data) ? data : data?.reviews || []
      
      const filtered = filter === 'all' 
        ? allReviews 
        : allReviews.filter((r: Review) => r.status === filter)
      
      setReviews(filtered)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast.error('Failed to load reviews')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const approveReview = async (id: string) => {
    try {
      await apiClient.put(`/reviews/moderate/${id}`, { status: 'approved' })
      toast.success('Review approved')
      setReviews(reviews.map(r => r._id === id ? { ...r, status: 'approved' } : r))
    } catch (error) {
      console.error('Failed to approve review:', error)
      toast.error('Failed to approve review')
    }
  }

  const rejectReview = async (id: string) => {
    try {
      await apiClient.put(`/reviews/moderate/${id}`, { status: 'rejected' })
      toast.success('Review rejected')
      setReviews(reviews.map(r => r._id === id ? { ...r, status: 'rejected' } : r))
    } catch (error) {
      console.error('Failed to reject review:', error)
      toast.error('Failed to reject review')
    }
  }

  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return
    
    try {
      await apiClient.delete(`/reviews/${id}`)
      toast.success('Review deleted')
      setReviews(reviews.filter(r => r._id !== id))
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review')
    }
  }

  if (loading) {
    return <PageLoader message="Loading reviews..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Moderation</h1>
          <p className="text-gray-600">Manage and moderate customer reviews</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-3">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-sm">
                  ({reviews?.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {reviews?.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No reviews to moderate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                      {review.isVerifiedPurchase && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          ✓ Verified Purchase
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {review.status.toUpperCase()}
                      </span>
                    </div>

                    {/* User & Product Info */}
                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>User:</strong> {review.user.name} ({review.user.email})</p>
                      <p><strong>Product:</strong> {review.product.name}</p>
                      <p><strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.rating}/5</span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {/* Helpful Count */}
                    <p className="text-sm text-gray-500">
                      👍 {review.helpfulCount} people found this helpful
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => approveReview(review._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      <FaCheck /> Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => rejectReview(review._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      <FaTimes /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
