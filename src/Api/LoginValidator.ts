import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoginForm, loginSchema } from "../Schema/LoginSchema";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { URL } from "./Endpoint";

const LoginValidator = () => {
    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
      } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
      const navigate = useNavigate();
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(String);
      const [password, setPassword] = useState(false);
    
      const submission = (Logindata: LoginForm) => {
        const loginUser = async () => {
          setLoading(true);
          try {
            const res = await axios.post(`${URL}/users/login`, Logindata);
            const data = res.data;
            console.log(data);
    
            if (res.status === 200) {
              localStorage.setItem("adminToken", data.token);
              localStorage.setItem("userName", data.name);
              localStorage.setItem("admin", data.isAdmin);
              setLoading(false);
              setSuccess("Login successful");
              await new Promise((resolve) => setTimeout(resolve, 3000))
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

      return { handleSubmit, error, errors, success, loading, setPassword, password, submission, register}
}

export default LoginValidator