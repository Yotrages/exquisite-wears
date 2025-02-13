import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaSpinner, FaEyeSlash } from "react-icons/fa";
import { loginSchema } from "../Schema/LoginSchema";
import Question from "./Question";

type LoginForm = z.infer<typeof loginSchema>;
const Login = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState(String);
  const [password, setPassword] = useState(false);

  const URL = "https://ecommerce-9wqc.onrender.com/api/users/login";
  const submission = (Logindata: LoginForm) => {
    const loginUser = async () => {
      setLoading(true);
      try {
        const res = await axios.post(URL, Logindata);
        const data = res.data;
        console.log(data);

        if (res.status === 200) {
          localStorage.setItem("adminToken", data.token);
          localStorage.setItem("userName", data.name);
          localStorage.setItem("admin", data.isAdmin);
          setLoading(false);
          setSucess("Login successful");
          setTimeout(() => setSucess(''), 3000)
          reset();
          if (!data.isAdmin) {
            navigate("/");
          } else {
            navigate("/admin");
          }
        }
      } catch (error: any) {
        console.error(error);
        if (error.response) {
          setError(error.response.data.message || "An error occured");
        } else if (error.request) {
          setError("No response from server, try checking your connection");
        } else {
          setError(error.message || "An error occured");
        }
        setLoading(false);
        setTimeout(() => setError(""), 3000);
        clearTimeout(3000);
      }
    };
    loginUser();
  };

 
  return (
    <>
      <div className="w-full absolute justify-center items-center flex top-1/4">
        {error && (
          <div className="bg-red-600 rounded-lg text-white fixed top-5 z-10 items-center justify-center text-center px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 rounded-lg text-white fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {success}
          </div>
        )}
        <form
          className="xs:w-[500px] w-full px-5"
          onSubmit={handleSubmit(submission)}
        >
          <div className="flex flex-col gap-8 px-2">
            <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
              <label
                htmlFor="email"
                id="email"
                className="text-[18px] font-semibold"
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
                id="email"
                className="text-[18px] font-semibold"
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
                  className="absolute right-4 top-4 text-[22px] text-black"
                  onClick={() => setPassword((prev) => !prev)}
                >
                  {password ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="rounded-lg  gap-4 py-3 px-7 bg-black-gradient bg-shadow text-white font-semibold text-[18px] tracking-widest"
            >
              {loading ? (
                <p className="flex items-center justify-center gap-3">
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
