import Register from '../Components/Register'
import { FaGem, FaTruck, FaShieldAlt, FaStar, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f57c00 0%, #e65100 50%, #bf360c 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-20 bg-white" style={{ filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 bg-white" style={{ filter: 'blur(100px)', transform: 'translate(30%, 30%)' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Exquisite</span>
            <span className="text-xs tracking-widest text-white/70 font-semibold uppercase">Wears</span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Join the<br />Community!
              </h2>
              <p className="text-orange-100 text-base leading-relaxed max-w-sm">
                Create your free account and start exploring thousands of premium products with exclusive member benefits.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                'Exclusive member-only deals and early access',
                'Track your orders in real time',
                'Save favorites to your personal wishlist',
                'Fast & secure checkout every time',
                'Earn reward points on every purchase',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <FaCheckCircle className="text-white/80 text-sm flex-shrink-0" />
                  <span className="text-orange-50 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '50k+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '1000+', label: 'Products' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{value}</p>
                <p className="text-xs text-orange-100 mt-0.5">{label}</p>
              </div>
            ))}
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
          <Link to="/login" className="text-sm font-semibold text-orange-500 border border-orange-400 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
            Sign in
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Create your account
              </h1>
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
            <Register />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
