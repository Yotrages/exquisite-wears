import { useForm } from "react-hook-form";
import { RegisterForm, registerSchema } from "../Schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { URL } from "./Endpoint";

const RegisterValidator = () => {
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
    
      const submission = (Logindata: RegisterForm) => {
        const loginUser = async () => {
          setLoading(true);
          try {
            console.log("Sending data:", Logindata);
            const res = await axios.post(`${URL}/users/register`, Logindata);
    
            if (res.status === 201) {
              console.log("Response:", res);
              setLoading(false);
              setSuccess("Registration successful");
              await new Promise((resolve) => setTimeout(resolve, 3000))
              reset();
              navigate("/login");
            } else {
              setLoading(false)
            }
          } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
              setError(error.response.data.message || "An error occurred" || error.response.dat.error);
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
      return { error, errors, success, register, handleSubmit, loading, password, submission, setPassword}
}

export default RegisterValidator;