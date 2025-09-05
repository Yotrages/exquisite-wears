import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "./Button";
import Modal from "./Modal";
import useProductValidator from "../Api/ProductValidator";

interface Product {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: string;
}

const SliderSkeletonCard = () => (
  <div className="flex-shrink-0 w-72 sm:w-80 lg:w-84">
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-4 sm:p-6 mx-2 sm:mx-4 h-[450px]">
      <div className="w-full h-48 bg-gray-400 rounded-xl mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
        <div className="h-3 bg-gray-400 rounded w-full"></div>
        <div className="h-3 bg-gray-400 rounded w-2/3"></div>
        <div className="h-6 bg-gray-400 rounded w-1/2 mt-4"></div>
        <div className="h-10 bg-gray-400 rounded w-full mt-4"></div>
      </div>
    </div>
  </div>
);

const WatchSlider = () => {
  const URL = "https://ecommerce-9wqc.onrender.com/api/products/get";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Modal states
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  // Auth states
  const token = localStorage.getItem("admin");
  const notAdmin = "true";

  // Responsive card width calculation
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 320;
    if (window.innerWidth < 640) return 288; // sm: w-72 = 288px
    if (window.innerWidth < 1024) return 320; // md: w-80 = 320px
    return 336; // lg: w-84 = 336px
  };

  const [cardWidth, setCardWidth] = useState(getCardWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCardWidth(getCardWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(URL);
        const data: Product[] = res.data.products;
        setProducts(data);
        
        const quantities = data.map((item) => item.quantity);
        localStorage.setItem("quantity", JSON.stringify(quantities));
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    getProducts();
  }, [navigator.onLine]);

  // Auto-scroll functionality with responsive consideration
  useEffect(() => {
    if (!isPaused && !isLoading && products.length > 0) {
      const interval = setInterval(() => {
        const maxSlides = Math.max(1, products.length - (window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 1 : 2));
        setCurrentSlide(prev => (prev + 1) % maxSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isLoading, products.length]);

  // Scroll to specific slide
  useEffect(() => {
    if (sliderRef.current) {
      const scrollLeft = currentSlide * cardWidth;
      sliderRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, cardWidth]);

  const nextSlide = () => {
    const maxSlides = Math.max(1, products.length - (window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 1 : 2));
    setCurrentSlide(prev => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    const maxSlides = Math.max(1, products.length - (window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 1 : 2));
    setCurrentSlide(prev => prev === 0 ? maxSlides - 1 : prev - 1);
  };

  const {handleEdit, deletePost} = useProductValidator()

  const SliderCard = ({ item, index }: { item: Product, index: number }) => (
    <div className="flex-shrink-0 w-72 sm:w-80 lg:w-84 group">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-6 mx-2 sm:mx-4 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-amber-100 relative overflow-hidden">
        {/* Luxury shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Premium badges */}
        {index < 3 && (
          <div className="absolute -top-3 -right-3 z-10">
            <div className={`
              px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white transform rotate-12
              ${index === 0 ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
                index === 1 ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 
                'bg-gradient-to-r from-green-500 to-emerald-600'}
            `}>
              {index === 0 ? '🏆 Featured' : index === 1 ? '🔥 Popular' : '✨ New'}
            </div>
          </div>
        )}
        
        {/* Product Image */}
        <div onClick={() => setShow(true)} className="relative overflow-hidden rounded-xl mb-4 sm:mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            className="w-full h-48 sm:h-56 object-cover cursor-pointer transition-all duration-700 group-hover:scale-110"
            src={item.image}
            alt={item.name}
            onClick={() => {
              setShow(true);
              setSelectedImage(item.image);
              setSelectedName(item.name);
            }}
          />
          
          {/* Overlay with zoom icon */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 sm:space-y-4">
          {/* Watch name */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
            {item.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed truncate">
            {item.description}
          </p>
          
          {/* Price and rating section */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {item.price?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </p>
              <p className="text-xs text-gray-500">Swiss Movement</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-amber-500 mb-1">
                <span className="text-base sm:text-lg">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-xs text-gray-500">Premium Quality</p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 py-1 sm:py-2">
            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">Water Resistant</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">Sapphire Glass</span>
          </div>

          {/* WhatsApp CTA Button - Fixed spacing */}
          <div className="pt-2 sm:pt-3">
            <Button
              onSmash={() => {
                const message = `Hello! I'm interested in this luxury timepiece:\n\n⌚ *${item.name}*\n💰 Price: ${item.price?.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}\n📸 Image: ${item.image}\n\nI'd like to know more about this watch's features and availability.`;
                const whatsappUrl = `https://api.whatsapp.com/send?phone=08145534450&text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              styles="w-full rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center font-semibold py-3 sm:py-4 text-sm sm:text-base"
              buttonText="💬 Inquire via WhatsApp"
              router=""
            />
          </div>

          {/* Admin Controls */}
          {token === notAdmin && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleEdit(item._id)}
                className="flex-1 rounded-lg py-2 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deletePost(item._id)}
                className="flex-1 rounded-lg py-2 px-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden">
      <Modal name={selectedName} setShow={setShow} show={show} image={selectedImage} />

      {/* Header Section */}
      <div className="text-center mb-12 sm:mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-700 text-sm font-medium mb-4 sm:mb-6">
          <span>⌚</span>
          <span>Curated Collection</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2">
          Exquisite Timepieces
        </h2>
        
        <p className="text-gray-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed px-4">
          Discover our handpicked selection of luxury wristwatches, where Swiss craftsmanship meets contemporary elegance. Each timepiece tells a story of precision, heritage, and unmatched sophistication.
        </p>
      </div>

      {/* Main Slider Section */}
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isLoading}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-2 sm:p-4 shadow-xl transition-all duration-300 hover:scale-110 group border border-amber-200/50 disabled:opacity-50"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isLoading}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-2 sm:p-4 shadow-xl transition-all duration-300 hover:scale-110 group border border-amber-200/50 disabled:opacity-50"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide gap-0 px-4 sm:px-8 py-6 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory'
            }}
          >
            {isLoading
              ? Array(6).fill(0).map((_, index) => <SliderSkeletonCard key={index} />)
              : products.map((item, index) => (
                  <div key={item._id} style={{ scrollSnapAlign: 'start' }}>
                    <SliderCard item={item} index={index} />
                  </div>
                ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {!isLoading && products.length > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8 gap-2 sm:gap-3 px-4">
            {Array(Math.max(1, products.length - (window.innerWidth < 640 ? 0 : window.innerWidth < 1024 ? 1 : 2)))
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? 'w-6 sm:w-8 h-2 sm:h-3 bg-gradient-to-r from-amber-600 to-yellow-600'
                      : 'w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
          </div>
        )}

        {/* Play/Pause indicator */}
        <div className="flex justify-center mt-4">
          <div className={`text-sm text-gray-500 transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-50'}`}>
            {isPaused ? '⏸️ Paused' : '▶️ Auto-playing'}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="flex justify-center mt-12 sm:mt-16">
        <div className="flex items-center gap-4 text-amber-600">
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-amber-600"></div>
          <span className="text-xl sm:text-2xl">⌚</span>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-amber-600"></div>
        </div>
      </div>
    </section>
  );
};

export default WatchSlider;