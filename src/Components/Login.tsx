import { FaEye, FaSpinner, FaEyeSlash } from "react-icons/fa";
import Question from "./Question";
import LoginValidator from "../Api/LoginValidator";
import Button from "./ui/Button";
import { useState } from "react";

const Login = () => {
  const {handleSubmit, submission, register, errors, password, setPassword, loading: apiLoading} = LoginValidator();
  const [loading, setLoading] = useState<string | null>(null);
 
  const handleOAuthLogin = (provider: string, intent = 'login') => {
    setLoading(provider);
    
    const state = btoa(JSON.stringify({ 
      intent: intent, 
      redirectUrl: intent === 'register' ? 'login' : 'oauth-success',
      timestamp: Date.now()
    }));
    
    window.location.href = `https://ecommerce-9wqc.onrender.com/api/users/auth/${provider}?state=${state}`;
  };
 
  return (
    <>
      <div className="w-full relative flex justify-center items-center px-3 xs:px-4">
        <form
          className="w-full max-w-[500px] px-2 xs:px-3"
          onSubmit={handleSubmit(submission)}
        >
          <div className="flex flex-col gap-4 px-2">
            <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
              <label
                htmlFor="email"
                id="email"
                className="text-base sm:text-lg font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                {...register("email", { required: true })}
                className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
                placeholder="Enter your Email"
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
              <label
                htmlFor="password"
                id="password"
                className="text-base sm:text-lg font-semibold"
              >
                Password
              </label>
              <div className="flex flex-col relative w-full">
                <input
                  type={password ? "text" : "password"}
                  id="password"
                  {...register("password", { required: true })}
                  required
                  placeholder="Enter your password"
                  className="px-3 py-3 w-full focus:outline-none text-black rounded-lg"
                />
                <span
                  className="absolute right-3 top-3 text-lg sm:text-xl cursor-pointer rounded-full text-black"
                  onClick={() => setPassword((prev) => !prev)}
                >
                  {password ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2 w-full">
              <Button 
                width="100%"
                onClick={() => handleOAuthLogin('google', 'login')}
                className="w-full"
              >
                {loading === 'google' ? 'Redirecting...' : 'Sign in with Google'}
              </Button>
              <Button 
                width="100%"
                onClick={() => handleOAuthLogin('github', 'login')}
                className="w-full"
              >
                {loading === 'github' ? 'Redirecting...' : 'Sign in with GitHub'}
              </Button>
            </div>
            <button
              type="submit"
              className="rounded-lg gap-4 py-2 px-4 sm:py-3 sm:px-7 bg-black-gradient bg-shadow text-white font-semibold text-sm sm:text-base tracking-widest"
            >
              {apiLoading ? (
                <p className={`flex items-center justify-center gap-3`}>
                  <FaSpinner className="animate-spin" />
                  Login
                </p>
              ) : (
                <p>Login</p>
              )}
            </button>
            <Question type="login"/>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;