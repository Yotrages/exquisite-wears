import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showCount?: number | null;
  className?: string;
}

const sizeMap = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const valueSizeMap = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * StarRating — shared component used across all screens for consistent star rendering.
 *
 * Renders half-stars for fractional ratings (e.g., 3.7 → 3 full + 1 half).
 * Shows numeric value and review count when requested.
 */
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showValue = false,
  showCount = null,
  className = '',
}) => {
  const safeRating = Math.min(Math.max(Number(rating) || 0, 0), maxStars);
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating - fullStars >= 0.3 && safeRating - fullStars < 0.8;
  const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <FaStar key={`full-${i}`} className="text-amber-400" />
        ))}
        {/* Half star */}
        {hasHalf && <FaStarHalfAlt className="text-amber-400" />}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </span>

      {showValue && safeRating > 0 && (
        <span className={`font-semibold text-amber-500 ${valueSizeMap[size]}`}>
          {safeRating.toFixed(1)}
        </span>
      )}

      {showCount !== null && (
        <span className={`text-gray-400 ${valueSizeMap[size]}`}>
          ({showCount.toLocaleString()})
        </span>
      )}
    </span>
  );
};

export default StarRating;
