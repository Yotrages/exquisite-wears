import { Link } from "react-router-dom";
import { bg4, social } from "../assets";
import { FaArrowAltCircleRight, FaClock, FaGem } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  image: string;
  quantity: string;
}

const Hero = () => {
  const URL = "https://ecommerce-9wqc.onrender.com/api/products/get";
  const [products, setProducts] = useState<Product[]>([]);
  

  const getLast = products[0]?.image ?? social;


  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(URL);
        const data: Product[] = res.data.products;

        setProducts(data);
       
        const quantities = data.map((item) => item.quantity);
        localStorage.setItem("quantity", JSON.stringify(quantities));
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
      }
    };
    getProducts();
  }, []);

  const token = localStorage.getItem("admin");
  const Admin = "true";
  const user = localStorage.getItem("userName");

  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative w-full min-h-screen">
        {/* Enhanced Background with Overlay */}
        <div className="absolute inset-0">
          <img
            src={bg4}
            className="w-full h-full object-cover"
            alt="Luxury Background"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 opacity-10 animate-pulse">
          <FaGem className="text-6xl text-white transform rotate-12" />
        </div>
        <div className="absolute bottom-32 left-16 opacity-10 animate-pulse">
          <FaClock className="text-8xl text-white transform -rotate-12" />
        </div>
        
        <div className="relative flex flex-col sm:py-28 md:py-40 py-16 md:flex-row gap-10 md:justify-between items-center md:items-start w-full md:h-full px-8 xl:px-16 md:px-14">
          <div className="flex flex-col md:items-start items-center gap-8 qy:gap-14 md:w-1/2 text-center md:text-left">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-300 text-sm font-medium">
              <FaGem className="text-xs" />
              <span>Premium Timepieces</span>
            </div>

            {/* Main Headline */}
            <h1 className="xs:text-4xl text-3xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Timeless
              </span>
              <br />
              <span className="text-white">Elegance</span>
              <br />
              <span className="text-amber-300">On Your Wrist</span>
            </h1>

            {/* Subheading */}
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2 className="xs:text-xl text-lg md:text-2xl lg:text-3xl font-light text-gray-200 leading-relaxed">
                Discover our exquisite collection of luxury wristwatches - where Swiss precision meets contemporary design.
              </h2>
              <h2 className="xs:text-lg text-base md:text-xl text-gray-300 leading-relaxed font-light">
                From classic dress watches to modern sports timepieces, each watch tells a story of craftsmanship, heritage, and impeccable style. Elevate every moment with timepieces that define sophistication.
              </h2>
            </div>

            {/* Features highlight */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Swiss Movement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Free Engraving</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                to={token === Admin ? '/admin' : user ? '#subscribe' : '/register'}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-amber-500/25 w-fit font-semibold text-lg overflow-hidden"
                id="subscribe"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <button className="relative z-10">
                  {token === Admin ? "Manage Collection" : user ? 'Explore Watches' : 'Start Your Journey' }
                </button>
                <FaArrowAltCircleRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {token === Admin && (
                <Link 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 w-fit font-semibold text-lg"  
                  to='/notification'
                >
                  <button>
                    Notify Collectors
                  </button>
                  <FaArrowAltCircleRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>

          {/* Enhanced Product Image Section */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center relative">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 border border-amber-400/20 rounded-full animate-spin-slow"></div>
              <div className="absolute w-80 h-80 border border-yellow-300/10 rounded-full animate-pulse"></div>
            </div>
            
            {/* Product image with enhanced styling */}
            <div className="relative z-10 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={getLast}
                className="relative w-full max-w-lg h-auto object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-2 border-amber-400/30"
                alt="Featured Luxury Watch"
              />
              {/* Product highlight badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                Featured
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Custom CSS for animations */}
      {/* <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style> */}
    </section>
  );
};

export default Hero;