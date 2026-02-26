import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, ChevronDown, X } from 'lucide-react';
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface Review {
  _id: string;
  user: { _id: string; name: string; profilePicture?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  images?: Array<{ url: string; publicId: string } | string>;
  helpful?: number;
  unhelpful?: number;
  verified?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  productRating?: number;
  totalReviews?: number;
  onReviewAdded?: () => void;
}

const Stars = ({
  rating,
  size = 16,
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= (interactive ? hovered || rating : Math.round(rating));
        return (
          <Star
            key={s}
            size={size}
            className={`transition-colors ${
              filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate?.(s)}
            onMouseEnter={() => interactive && setHovered(s)}
            onMouseLeave={() => interactive && setHovered(0)}
          />
        );
      })}
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productRating = 0,
  totalReviews = 0,
  onReviewAdded,
}) => {
  const { user } = useSelector((state: any) => state.authSlice);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingBreakdown, setRatingBreakdown] = useState<Record<number, number>>({});
  const [totalFromApi, setTotalFromApi] = useState(totalReviews);
  const [avgFromApi, setAvgFromApi] = useState(productRating);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating-high' | 'rating-low'>('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
  const [formError, setFormError] = useState('');

  const fetchReviews = async (pg = 1) => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(
        `/reviews/product/${productId}?page=${pg}&limit=8&sortBy=${sortBy}`
      );
      const data = res.data;
      setReviews(data.reviews || []);
      setRatingBreakdown(data.ratingBreakdown || {});
      setTotalFromApi(data.pagination?.totalReviews ?? totalReviews);
      setTotalPages(data.pagination?.totalPages ?? 1);

      // Compute avg from breakdown if not in response
      const bd: Record<number, number> = data.ratingBreakdown || {};
      const total = Object.values(bd).reduce((a: number, b: number) => a + b, 0);
      if (total > 0) {
        const sum = Object.entries(bd).reduce(
          (a, [k, v]) => a + parseInt(k) * (v as number),
          0
        );
        setAvgFromApi(parseFloat((sum / total).toFixed(1)));
      }
    } catch {
      // Silently fail – product may have no reviews yet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews(1);
  }, [productId, sortBy]);

  const displayedReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!user) { toast.error('Please log in to write a review'); return; }
    if (!formData.title.trim()) { setFormError('Review title is required'); return; }
    if (formData.comment.trim().length < 10) { setFormError('Review must be at least 10 characters'); return; }

    try {
      setSubmitting(true);
      await apiClient.post('/reviews', {
        product: productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      });

      toast.success('Review submitted! It will appear after moderation.');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      fetchReviews(1);
      onReviewAdded?.();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to submit review';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (helpfulClicked.has(reviewId)) return;
    try {
      await apiClient.post(`/reviews/${reviewId}/helpful`, {});
      setReviews((prev) =>
        prev.map((r) => r._id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r)
      );
      setHelpfulClicked((prev) => new Set(prev).add(reviewId));
    } catch { }
  };

  const totalCount = totalFromApi || totalReviews;
  const avgRating = avgFromApi || productRating;

  return (
    <div className="space-y-6">
      {/* ── SUMMARY ── */}
      <div className="grid sm:grid-cols-5 gap-6 p-5 bg-orange-50 rounded-2xl border border-orange-100">
        {/* Score */}
        <div className="sm:col-span-2 flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {avgRating.toFixed(1)}
          </div>
          <Stars rating={avgRating} size={20} />
          <p className="text-sm text-gray-500 mt-2 font-medium">{totalCount.toLocaleString()} review{totalCount !== 1 ? 's' : ''}</p>
        </div>

        {/* Bar chart */}
        <div className="sm:col-span-3 space-y-2">
          {[5, 4, 3, 2, 1].map((r) => {
            const count = ratingBreakdown[r] || 0;
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <button
                key={r}
                onClick={() => setFilterRating(filterRating === r ? null : r)}
                className={`w-full flex items-center gap-2 group transition-all ${filterRating === r ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
              >
                <span className="text-sm font-semibold text-gray-600 w-6 text-right">{r}</span>
                <Star size={12} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${filterRating === r ? 'bg-orange-500' : 'bg-amber-400 group-hover:bg-orange-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-6">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── WRITE REVIEW & CONTROLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {filterRating && (
            <div className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold">
              {filterRating} stars only
              <button onClick={() => setFilterRating(null)} className="ml-1 hover:text-orange-900">
                <X size={14} />
              </button>
            </div>
          )}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 font-medium focus:outline-none focus:border-orange-400 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {user ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-orange-200"
          >
            <Star size={14} className="fill-white" />
            Write a Review
          </button>
        ) : (
          <a
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all"
          >
            Log in to Review
          </a>
        )}
      </div>

      {/* ── REVIEW FORM ── */}
      {showForm && (
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Share Your Experience</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
              <div className="flex items-center gap-3">
                <Stars
                  rating={formData.rating}
                  size={30}
                  interactive
                  onRate={(r) => setFormData((p) => ({ ...p, rating: r }))}
                />
                <span className="text-sm text-gray-500 font-medium">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formData.rating]}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Title</label>
              <input
                type="text"
                maxLength={100}
                placeholder="Summarize your experience..."
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review</label>
              <textarea
                maxLength={1000}
                placeholder="Tell others what you think about this product. Quality, sizing, value for money..."
                value={formData.comment}
                onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{formData.comment.length}/1000</p>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <X size={16} className="flex-shrink-0" />
                {formError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── REVIEWS LIST ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedReviews.length === 0 ? (
        <div className="py-16 text-center">
          <Star size={40} className="text-gray-200 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-700 mb-1">
            {reviews.length === 0 ? 'No Reviews Yet' : 'No reviews match this filter'}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            {reviews.length === 0
              ? 'Be the first to review this product!'
              : 'Try removing the filter to see all reviews.'}
          </p>
          {reviews.length === 0 && user && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => {
            const avatarLetter = review.user?.name?.charAt(0)?.toUpperCase() || 'U';
            const imageUrl = (img: any) => typeof img === 'string' ? img : img?.url;
            return (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                      {review.user?.profilePicture ? (
                        <img
                          src={review.user.profilePicture}
                          alt={review.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                            <CheckCircle size={11} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Stars rating={review.rating} size={14} />
                </div>

                {/* Content */}
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{review.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

                {/* Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.slice(0, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={imageUrl(img)}
                        alt={`Review image ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                      />
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Was this helpful?</span>
                  <button
                    onClick={() => handleMarkHelpful(review._id)}
                    disabled={helpfulClicked.has(review._id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      helpfulClicked.has(review._id)
                        ? 'bg-orange-100 text-orange-600 cursor-default'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    Yes ({review.helpful || 0})
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {page > 1 && (
                <button
                  onClick={() => { setPage(page - 1); fetchReviews(page - 1); }}
                  className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  ← Prev
                </button>
              )}
              <span className="text-sm text-gray-500 px-2">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <button
                  onClick={() => { setPage(page + 1); fetchReviews(page + 1); }}
                  className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
