import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoginForm, loginSchema } from "../Schema/LoginSchema";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import apiClient from "./axiosConfig";
import { setAuthToken } from "../utils/cookieManager";
import { loginSuccess } from "../redux/authSlice";
import { LoginResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const LoginValidator = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState(false);

  const submission = (Logindata: LoginForm) => {
    const loginUser = async () => {
      setLoading(true);
      try {
        const res = await apiClient.post<LoginResponse>(
          `/users/login`,
          Logindata
        );
        const data = res.data;
        console.log("Login response:", data);

        if (res.status === 200) {
          // Store token in secure cookie instead of localStorage
          setAuthToken(data.token);

          // Dispatch Redux action to update auth state
          dispatch(
            loginSuccess({
              token: data.token,
              user: {
                _id: data._id,
                email: data.email,
                name: data.name,
                isAdmin: data.isAdmin,
              },
            })
          );

          setLoading(false);
          setSuccess("Login successful");
          toast.success("Login successful");

          await new Promise((resolve) => setTimeout(resolve, 1500));
          reset();

          // Redirect based on user role
          const redirectParam = new URLSearchParams(window.location.search).get(
            "redirect"
          );
          if (redirectParam) {
            navigate(redirectParam);
          } else if (!data.isAdmin) {
            navigate("/");
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setLoading(false);

        if (error.response) {
          const errorMsg =
            error.response.data.message || error.response.data.error;
          setError(errorMsg);
          toast.error(errorMsg);
        } else if (error.request) {
          setError(
            "No response from server, try checking your connection"
          );
          toast.error("Server not responding");
        } else {
          setError(error.message || "An unknown error occurred");
          toast.error("Login failed");
        }

        setTimeout(() => setError(""), 5000);
      }
    };

    loginUser();
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

export default LoginValidator;