import { useForm } from "react-hook-form";
import { RegisterForm, registerSchema } from "../Schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "./axiosConfig";
import { setAuthToken } from "../utils/cookieManager";
import { loginSuccess } from "../redux/authSlice";
import { RegisterResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const RegisterValidator = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState(false);

  const submission = (registerData: RegisterForm) => {
    const registerUser = async () => {
      setLoading(true);
      try {
        console.log("Sending data:", registerData);
        const res = await apiClient.post<RegisterResponse>(
          `/users/register`,
          registerData
        );

        if (res.status === 201) {
          console.log("Response:", res.data);
          
          // Store token in secure cookie
          setAuthToken(res.data.token);

          // Dispatch Redux action to update auth state
          dispatch(
            loginSuccess({
              token: res.data.token,
              user: {
                _id: res.data._id,
                email: res.data.email,
                name: res.data.name,
                isAdmin: res.data.isAdmin,
              },
            })
          );

          setLoading(false);
          setSuccess("Registration successful");
          toast.success("Registration successful! Redirecting...");

          await new Promise((resolve) => setTimeout(resolve, 1500));
          reset();
          navigate("/");
        } else {
          setLoading(false);
          setError("Registration failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Error details:", error);
        setLoading(false);

        if (error.response) {
          const errorMsg =
            error.response.data.message || error.response.data.error || "An error occurred";
          setError(errorMsg);
          toast.error(errorMsg);
        } else if (error.request) {
          setError("No response from server, check your connection and try again");
          toast.error("Server not responding");
        } else {
          setError(error.message || "An error occurred");
          toast.error("Registration failed");
        }

        setTimeout(() => setError(""), 5000);
      }
    };

    registerUser();
  };

  return {
    handleSubmit,
    register,
    errors,
    submission,
    error,
    loading,
    success,
    password,
    setPassword,
  };
};

export default RegisterValidator;