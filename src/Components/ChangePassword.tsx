import ForgotPasswordValidator from '../Api/ForgotPassword'
import { FaEye, FaEyeSlash, FaSpinner, FaEnvelope, FaLock } from 'react-icons/fa'

const ChangePassword = () => {
  const { errors, handleSubmit, ForgotPassword, register, loading, password, setPassword } = ForgotPasswordValidator()

  return (
    <form onSubmit={handleSubmit(ForgotPassword)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type="email"
            id="email"
            required
            {...register("email", { required: true })}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
        <div className="relative">
          <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type={password ? "text" : "password"}
            id="password"
            {...register("password", { required: true })}
            required
            placeholder="Enter new password"
            className="w-full pl-10 pr-11 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setPassword(prev => !prev)}
          >
            {password ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
      >
        {loading ? <><FaSpinner className="animate-spin" /> Submitting...</> : 'Reset Password'}
      </button>
    </form>
  )
}

export default ChangePassword
