import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerSchema } from "../Schema/RegisterSchema";
import Question from "./Question";

type RegisterForm = z.infer<typeof registerSchema>;
const Register = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(String);
  const [password, setPassword] = useState(false);

  const URL = "https://ecommerce-9wqc.onrender.com/api/users/register";
  const submission = (Logindata: RegisterForm) => {
    const loginUser = async () => {
      setLoading(true);
      try {
        console.log("Sending data:", Logindata);
        const res = await axios.post(URL, Logindata);

        if (res.status === 201) {
          console.log("Response:", res);
          setLoading(false);
          setSuccess("Login successful");
          setTimeout(() => setSuccess(''), 3000)
          reset();
          navigate("/login");
        } else {
          setLoading(false)
        }
      } catch (error: any) {
        console.error("Error details:", error);
        if (error.response) {
          setError(error.response.data.message || "An error occurred");
        } else if (error.request) {
          setError("No response from server, check your connection and try again");
        } else {
          setError(error.message || "An error occurred");
        }
        setTimeout(() => setError(""), 3000)
        setLoading(false);
      }
    };
    loginUser();
  };

  return (
    <div className="w-full absolute justify-center items-center flex top-1/4">
        {error && (
          <div className="bg-red-600 rounded-lg text-white fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 rounded-lg text-white fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {success}
          </div>
        )}
      <div className="fixed items-center justify-center top-20">
      </div>
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
              htmlFor="name"
              id="name"
              className="text-[18px] font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              required
              {...register("name", { required: true })}
              className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              placeholder="Enter your Username"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
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
                Register
              </p>
            ) : (
              <p>Register</p>
            )}
          </button>
          <Question type="register"/>
        </div>
      </form>
    </div>
  );
};

export default Register;
