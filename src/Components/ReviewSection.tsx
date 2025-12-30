import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, User, Calendar, Verified } from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpfulCount?: number;
  isVerifiedPurchase?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  productRating?: number;
  totalReviews?: number;
  onReviewAdded?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productRating = 0,
  totalReviews = 0,
  onReviewAdded,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [formError, setFormError] = useState('');

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/reviews/product/${productId}`);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'helpful') {
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      } else {
        return b.rating - a.rating;
      }
    });

  // Handle form submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.title.trim()) {
      setFormError('Review title is required');
      return;
    }
    if (!formData.comment.trim()) {
      setFormError('Review comment is required');
      return;
    }
    if (formData.comment.trim().length < 10) {
      setFormError('Review must be at least 10 characters');
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.post(
          `/reviews`,
        {
          product: productId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        }
      );

      // Reset form
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);

      // Refresh reviews
      const response = await apiClient.get(`/reviews/product/${productId}`);
      setReviews(response.data.reviews || []);

      // Notify parent
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marking helpful
  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await apiClient.post(
        `/reviews/${reviewId}/helpful`,
        {}
      );

      // Update local state
      setReviews(
        reviews.map((review) =>
          review._id === reviewId
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        )
      );
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  // Rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">{productRating.toFixed(1)}</span>
              <span className="text-gray-600">out of 5</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.floor(productRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-2">{totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-3">
            {(ratingDistribution || []).map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer min-w-12"
                >
                  {rating} star
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="border-t pt-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Share your experience</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="transition"
                  >
                    <Star
                      size={28}
                      className={
                        rating <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <input
                type="text"
                maxLength={100}
                placeholder="Sum up your experience"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                maxLength={1000}
                placeholder="Share details about your experience..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.comment.length}/1000 characters
              </p>
            </div>

            {/* Error Message */}
            {formError && <div className="text-red-600 text-sm">{formError}</div>}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <div className="border-t pt-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {filterRating && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">{filterRating} stars</span>
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading && reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(filteredReviews || []).map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.user.name}</p>
                      {review.isVerifiedPurchase && (
                        <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-xs">
                          <Verified size={12} />
                          Verified Purchase
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Title and Comment */}
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* Review Images */}
              {(review.images || []).length > 0 && (
                <div className="flex gap-2 mb-4">
                  {(review.images || []).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => handleMarkHelpful(review._id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
                >
                  <ThumbsUp size={16} />
                  Helpful ({review.helpfulCount || 0})
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition">
                  <Flag size={16} />
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
