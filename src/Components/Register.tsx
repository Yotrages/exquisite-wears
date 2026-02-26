import { FaEye, FaEyeSlash, FaSpinner, FaGoogle, FaGithub, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import RegisterValidator from "../Api/RegisterValidator";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    handleSubmit,
    errors,
    submission,
    loading: apiLoading,
    password,
    register,
    setPassword,
  } = RegisterValidator();

  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const suggest = searchParams.get('suggest');

  const handleOAuthLogin = (provider: string) => {
    setOauthLoading(provider);
    const state = btoa(JSON.stringify({
      intent: 'register',
      redirectUrl: 'login',
      timestamp: Date.now()
    }));
    window.location.href = `https://ecommerce-9wqc.onrender.com/api/users/auth/${provider}?state=${state}`;
  };

  return (
    <div className="w-full space-y-5">
      {/* Suggest login banner */}
      {suggest === 'login' && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700">
          It looks like you already have an account.{' '}
          <Link to="/login" className="underline font-semibold">Sign in instead</Link>
        </div>
      )}

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-400 hover:bg-orange-50 transition-all disabled:opacity-60"
        >
          {oauthLoading === 'google' ? <FaSpinner className="animate-spin text-gray-500" /> : <FaGoogle className="text-red-500" />}
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-800 hover:bg-gray-50 transition-all disabled:opacity-60"
        >
          {oauthLoading === 'github' ? <FaSpinner className="animate-spin" /> : <FaGithub className="text-gray-800" />}
          GitHub
        </button>
      </div>

      <div className="divider-text text-xs font-medium">or register with email</div>

      {/* Form */}
      <form onSubmit={handleSubmit(submission)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="email"
              {...register("email")}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
          <div className="relative">
            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              {...register("name")}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              placeholder="Choose a username"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type={password ? "text" : "password"}
              {...register("password")}
              required
              placeholder="Create a strong password"
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

        {/* Terms */}
        <p className="text-xs text-gray-400 leading-relaxed">
          By creating an account, you agree to our{' '}
          <Link to="/about" className="text-orange-500 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/about" className="text-orange-500 hover:underline">Privacy Policy</Link>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={apiLoading}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
        >
          {apiLoading ? <><FaSpinner className="animate-spin" /> Creating account...</> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
