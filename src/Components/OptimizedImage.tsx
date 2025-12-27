import React, { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  responsiveImages?: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    webp?: string;
    thumbnail_webp?: string;
  };
  lazy?: boolean;
}

/**
 * Optimized image component with lazy loading and responsive sizing
 * Automatically serves WebP format when supported
 */
const OptimizedImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  responsiveImages,
  lazy = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine which image to use based on viewport
  const getImageUrl = () => {
    if (!responsiveImages) return src;

    const width = window.innerWidth;

    if (width < 400) {
      return responsiveImages.thumbnail || src;
    } else if (width < 600) {
      return responsiveImages.small || responsiveImages.medium || src;
    } else if (width < 1000) {
      return responsiveImages.medium || responsiveImages.large || src;
    } else {
      return responsiveImages.large || src;
    }
  };

  const imageUrl = getImageUrl();

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP format for modern browsers */}
      {responsiveImages?.webp && (
        <source srcSet={responsiveImages.webp} type="image/webp" />
      )}
      {responsiveImages?.thumbnail_webp && (
        <source srcSet={responsiveImages.thumbnail_webp} media="(max-width: 400px)" type="image/webp" />
      )}

      {/* Fallback to JPEG */}
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;
