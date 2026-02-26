import { Link } from "react-router-dom";
import { bg4, social } from "../assets";
import { FaChevronRight, FaGem, FaPlay, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useState, useEffect } from "react";
import { apiClient } from '../Api/axiosConfig';
import { Product } from '../Types/Product';
import { useNavigate } from "react-router-dom";

const SLIDES = [
  {
    badge: "New Collection",
    headline: ["Timeless", "Luxury", "On Your Wrist"],
    sub: "Discover Swiss-crafted timepieces that define elegance and precision for every occasion.",
    cta: "Shop Collection",
    ctaLink: "/search/all",
    ctaSecondary: "View Lookbook",
    bgFrom: "#1a1a2e",
    bgTo: "#16213e",
    accent: "#f57c00",
  },
  {
    badge: "Flash Sale — Up to 60% Off",
    headline: ["Exclusive", "Deals", "Today Only"],
    sub: "Limited time offers on our most sought-after timepieces. Don't miss out.",
    cta: "Grab Deals",
    ctaLink: "/search/flash sales",
    ctaSecondary: "See All Offers",
    bgFrom: "#7b1fa2",
    bgTo: "#4a148c",
    accent: "#ffd600",
  },
  {
    badge: "Free Delivery",
    headline: ["Premium", "Watches", "Free Shipping"],
    sub: "Orders above ₦50,000 get free nationwide delivery. Luxury made accessible.",
    cta: "Shop Now",
    ctaLink: "/search/all",
    ctaSecondary: "Learn More",
    bgFrom: "#0d47a1",
    bgTo: "#1565c0",
    accent: "#00e5ff",
  },
];

const Trust = [
  { icon: "🚚", label: "Free Delivery", sub: "Orders ₦50k+" },
  { icon: "🔒", label: "Secure Payment", sub: "100% Protected" },
  { icon: "↩️", label: "Easy Returns", sub: "7-day policy" },
  { icon: "⭐", label: "Premium Quality", sub: "Certified authentic" },
];

const Hero = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [slide, setSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const featuredImage = products[0]?.image ?? social;

  useEffect(() => {
    apiClient.get('/products/get').then(res => {
      setProducts(res.data?.products || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDES.length);
        setTransitioning(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = SLIDES[slide];
  const token = localStorage.getItem("admin");
  const user = localStorage.getItem("userName");

  return (
    <section className="w-full">
      {/* === HERO BANNER === */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${current.bgFrom} 0%, ${current.bgTo} 100%)`,
          minHeight: '480px',
          transition: 'background 0.5s ease',
        }}
      >
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img src={bg4} className="w-full h-full object-cover opacity-20" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 -translate-y-1/2 translate-x-1/3"
          style={{ background: current.accent, filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full opacity-10 translate-y-1/2"
          style={{ background: current.accent, filter: 'blur(60px)' }} />

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>

          {/* Left content */}
          <div className="flex-1 text-white space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ borderColor: current.accent + '60', background: current.accent + '20', color: current.accent }}>
              <HiSparkles />
              {current.badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {current.headline.map((line, i) => (
                <div key={i} className={i === 1 ? 'text-gradient' : ''} style={i === 1 ? { WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: `linear-gradient(135deg, ${current.accent}, #fff)` } : {}}>
                  {line}
                </div>
              ))}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-md leading-relaxed">{current.sub}</p>

            {/* Rating social proof */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => <FaStar key={i} className="text-amber-400 text-sm" />)}
              </div>
              <span className="text-sm text-gray-300">4.9/5 from <span className="text-white font-semibold">2,400+</span> reviews</span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={token === "true" ? '/admin' : user ? (current as any).ctaLink || '/search/all' : '/register'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: current.accent, color: '#fff' }}
              >
                {current.cta}
                <FaChevronRight className="text-xs" />
              </Link>
              <button
                onClick={() => navigate('/search/all')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 backdrop-blur-sm"
              >
                <FaPlay className="text-xs" />
                {current.ctaSecondary}
              </button>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 pt-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === slide ? '24px' : '8px',
                    height: '8px',
                    background: i === slide ? current.accent : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: featured product */}
          <div className="flex-shrink-0 relative w-full max-w-xs lg:max-w-sm">
            <div className="relative group">
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: current.accent }} />

              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img
                  src={featuredImage}
                  alt="Featured Product"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Product info overlay */}
                {products[0] && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm line-clamp-1">{products[0].name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-amber-400 font-black text-lg">₦{products[0].price?.toLocaleString()}</span>
                      <button
                        onClick={() => navigate(`/product/${products[0]._id}`)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                        style={{ background: current.accent, color: '#fff' }}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gem badge */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: current.accent }}>
                <FaGem className="text-white text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === TRUST BADGES BAR === */}
      <div className="bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-gray-100">
            {Trust.map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 justify-center sm:justify-start px-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
