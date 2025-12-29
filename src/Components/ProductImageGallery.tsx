import { useState } from 'react'
import { FaSearchPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Props {
  images?: string[]
  productName: string
}

export default function ProductImageGallery({ images = [], productName }: Props) {
  const safeImages = images || [];
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setMousePosition({ x, y })
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? Math.max(safeImages.length - 1, 0) : prev - 1))
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <div
          className="relative w-full h-full cursor-zoom-in"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={safeImages[selectedImage] || '/placeholder.jpg'}
            alt={`${productName} - View ${selectedImage + 1}`}
            className={`w-full h-full object-contain transition-all duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : {}
            }
          />
        </div>

        {/* Zoom Icon */}
        <button
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          onClick={(e) => {
            e.stopPropagation()
            setIsZoomed(!isZoomed)
          }}
        >
          <FaSearchPlus className="text-gray-700" />
        </button>

        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <FaChevronLeft className="text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <FaChevronRight className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
          {selectedImage + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Hint */}
      {!isZoomed && (
        <p className="text-sm text-gray-500 text-center">
          Click or hover on image to zoom
        </p>
      )}
    </div>
  )
}
