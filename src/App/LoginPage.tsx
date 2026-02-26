import Login from "../Components/Login"
import { FaShieldAlt, FaTruck, FaStar, FaGem } from "react-icons/fa"
import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#f57c00', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#f57c00', filter: 'blur(100px)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Exquisite</span>
            <span className="text-xs tracking-widest text-orange-400 font-semibold uppercase">Wears</span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome<br />Back!
              </h2>
              <p className="text-gray-300 text-base leading-relaxed max-w-sm">
                Sign in to access your account, track orders, and discover exclusive deals curated just for you.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: FaGem, text: 'Premium timepieces & luxury accessories', color: '#f57c00' },
                { icon: FaTruck, text: 'Free delivery on orders above ₦50,000', color: '#4caf50' },
                { icon: FaShieldAlt, text: '100% secure payment & buyer protection', color: '#2196f3' },
                { icon: FaStar, text: 'Rated 4.9/5 by 2,400+ happy customers', color: '#ffc107' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '20', border: `1px solid ${color}40` }}>
                    <Icon style={{ color }} className="text-sm" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex mb-2">
              {[1,2,3,4,5].map(i => <FaStar key={i} className="text-amber-400 text-xs" />)}
            </div>
            <p className="text-gray-200 text-sm leading-relaxed mb-3 italic">
              "Exquisite Wears has the most beautiful collection I've ever seen. The quality is unmatched!"
            </p>
            <p className="text-orange-400 text-xs font-bold">— Adaeze O., Lagos</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Exquisite</span>
            <span className="text-[10px] tracking-widest text-orange-500 font-semibold uppercase">Wears</span>
          </Link>
          <Link to="/register" className="text-sm font-semibold text-orange-500 border border-orange-400 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
            Sign up
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Sign in to your account
              </h1>
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                  Create one free
                </Link>
              </p>
            </div>
            <Login />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
