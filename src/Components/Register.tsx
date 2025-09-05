import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import Question from "./Question";
import { MessageCenter } from "./Message";
import RegisterValidator from "../Api/RegisterValidator";
import Button from "./ui/Button";
import { useState } from "react";

const Register = () => {
  const {
    handleSubmit,
    error,
    errors,
    submission,
    success,
    loading: apiLoading,
    password,
    register,
    setPassword,
  } = RegisterValidator();
   const [loading, setLoading] = useState<string | null>(null);
 
    const searchParams = new URLSearchParams(window.location.search)
  const oAuthError = searchParams.get('error')

  if (oAuthError) {
    <MessageCenter error={oAuthError} />
  }

  const handleOAuthLogin = (provider: string, intent = 'login') => {
    setLoading(provider);
    
    const state = btoa(JSON.stringify({ 
      intent: intent, 
      redirectUrl: intent === 'register' ? 'login' : 'oauth-success',
      timestamp: Date.now()
    }));
    
    window.location.href = `https://ecommerce-9wqc.onrender.com/api/auth/${provider}?state=${state}`;
  };

  return (
    <div className="w-full relative flex justify-center items-center">
      <MessageCenter success={success} error={error} />
      <form
        className="xs:w-[500px] w-full px-5"
        onSubmit={handleSubmit(submission)}
      >
        <div className="flex flex-col gap-4 px-2">
          {/* Email Input */}
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label htmlFor="email" className="text-[18px] font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              {...register("email")}
              className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              placeholder="Enter your Email"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Username Input */}
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label htmlFor="name" className="text-[18px] font-semibold">
              Username
            </label>
            <input
              type="text"
              id="name"
              required
              {...register("name")}
              className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              placeholder="Enter your Username"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label htmlFor="password" className="text-[18px] font-semibold">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={password ? "text" : "password"}
                id="password"
                {...register("password")}
                required
                placeholder="Enter your password"
                className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              />
              <span
                className="absolute right-4 top-4 text-[22px] text-black cursor-pointer"
                onClick={() => setPassword((prev) => !prev)}
              >
                {password ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2 w-full ">
          <Button 
          width="100%"
            onClick={() => handleOAuthLogin('google', 'register')}
            className="w-full"
            variant="filled"
          >
            {loading === 'google' ? 'Redirecting...' : 'Sign up with Google'}
          </Button>
          <Button 
          width="100%"
            onClick={() => handleOAuthLogin('github', 'register')}
            className="w-full"
            variant="filled"
          >
            {loading === 'github' ? 'Redirecting...' : 'Sign up with GitHub'}
          </Button>
        </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg gap-4 py-3 px-7 bg-black-gradient bg-shadow text-white font-semibold text-[18px] tracking-widest"
          >
            {apiLoading ? (
              <p className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" /> Register
              </p>
            ) : (
              "Register"
            )}
          </button>

          <Question type="register" />
        </div>
      </form>
    </div>
  );
};

export default Register