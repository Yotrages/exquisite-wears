import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "./Button";
import Modal from "./Modal";
import { MessageRight } from "./Message";

interface Product {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: string;
}

const SliderSkeletonCard = () => (
  <div className="flex-shrink-0 w-80 animate-pulse">
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl p-6 mx-4 h-[450px]">
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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  
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

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(URL);
        const data: Product[] = res.data.products;
        setProducts(data);
        setSuccess("Products loaded successfully!");
        
        const quantities = data.map((item) => item.quantity);
        localStorage.setItem("quantity", JSON.stringify(quantities));
      } catch (error: any) {
        setError("Error fetching products: " + error.message);
        console.error("Error fetching products:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    getProducts();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && !isLoading && products.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % Math.max(1, products.length - 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isLoading, products.length]);

  // Scroll to specific slide
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = 320; // w-80 = 320px
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.max(1, products.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? Math.max(0, products.length - 3) : prev - 1);
  };

  const handleEdit = (id: string) => {
    // Add your edit logic here
    console.log("Edit product:", id);
  };

  const handleDelete = (id: string) => {
    // Add your delete logic here
    console.log("Delete product:", id);
  };

  const SliderCard = ({ item, index }: { item: Product, index: number }) => (
    <div className="flex-shrink-0 w-80 group">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 mx-4 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-amber-100 relative overflow-hidden">
        {/* Luxury shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Premium badges */}
        {index < 3 && (
          <div className="absolute -top-3 -right-3 z-10">
            <div className={`
              px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white transform rotate-12
              ${index === 0 ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
                index === 1 ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 
                'bg-gradient-to-r from-green-500 to-emerald-600'}
            `}>
              {index === 0 ? '🏆 Featured' : index === 1 ? '🔥 Popular' : '✨ New'}
            </div>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            className="w-full h-56 object-cover cursor-pointer transition-all duration-700 group-hover:scale-110"
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
        <div className="space-y-4">
          {/* Watch name */}
          <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
            {item.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {item.description}
          </p>
          
          {/* Price and rating section */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {item.price?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </p>
              <p className="text-xs text-gray-500">Swiss Movement</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-amber-500 mb-1">
                <span className="text-lg">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-xs text-gray-500">Premium Quality</p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 py-2">
            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">Water Resistant</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">Sapphire Glass</span>
          </div>

          {/* WhatsApp CTA Button */}
          <Button
            onSmash={() => {
              const message = `Hello! I'm interested in this luxury timepiece:\n\n⌚ *${item.name}*\n💰 Price: ${item.price?.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}\n📸 Image: ${item.image}\n\nI'd like to know more about this watch's features and availability.`;
              const whatsappUrl = `https://api.whatsapp.com/send?phone=08145534450&text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, "_blank");
            }}
            styles="w-full rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center font-semibold py-4 text-base"
            buttonText="💬 Inquire via WhatsApp"
            router=""
          />

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
                onClick={() => handleDelete(item._id)}
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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden">
      <MessageRight success={success} error={error} />
      <Modal name={selectedName} setShow={setShow} show={show} image={selectedImage} />

      {/* Header Section */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-700 text-sm font-medium mb-6">
          <span>⌚</span>
          <span>Curated Collection</span>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-6 leading-tight">
          Exquisite Timepieces
        </h2>
        
        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 group border border-amber-200/50 disabled:opacity-50"
        >
          <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white backdrop-blur-md rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 group border border-amber-200/50 disabled:opacity-50"
        >
          <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slider Container */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-0 px-8 py-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array(6).fill(0).map((_, index) => <SliderSkeletonCard key={index} />)
            : products.map((item, index) => (
                <SliderCard key={item._id} item={item} index={index} />
              ))}
        </div>

        {/* Dots Indicator */}
        {!isLoading && products.length > 3 && (
          <div className="flex justify-center mt-8 gap-3">
            {Array(Math.max(1, products.length - 2))
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? 'w-8 h-3 bg-gradient-to-r from-amber-600 to-yellow-600'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
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
      <div className="flex justify-center mt-16">
        <div className="flex items-center gap-4 text-amber-600">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-600"></div>
          <span className="text-2xl">⌚</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-600"></div>
        </div>
      </div>

      {/* Custom CSS */}
      {/* <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style> */}
    </section>
  );
};

export default WatchSlider;