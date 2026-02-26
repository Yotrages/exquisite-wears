import ChangePassword from "../Components/ChangePassword"
import { FaLock } from "react-icons/fa"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 bg-orange-500" style={{ filter: 'blur(100px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5 bg-orange-500" style={{ filter: 'blur(80px)', transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center leading-none mb-6">
            <span className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Exquisite</span>
            <span className="text-xs tracking-widest text-orange-500 font-semibold uppercase">Wears</span>
          </Link>

          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-2xl text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Reset your password</h1>
          <p className="text-gray-500 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <ChangePassword />
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Remember your password?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
