import { useState } from "react";
import { useForm } from "react-hook-form";
import { SubSchema, SubscribeForm } from "../Schema/SubscribeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "./axiosConfig";
import { SubscribeResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const subscribeValidator = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SubscribeForm>({ resolver: zodResolver(SubSchema) });
  const subscribe = (email: SubscribeForm) => {
    const subscription = async () => {
      setLoading(true);
      try {
        const res = await apiClient.post<SubscribeResponse>(`/subscribe`, email);
        if (res.status === 201) {
          setLoading(false);
          setSuccess("Subscription Successful");
          toast.success("Subscribed successfully");
          reset();
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || "Failed to subscribe";
        setError(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => setError(""), 5000);
      } finally {
        setLoading(false);
      }
    };
    subscription();
  };
  const date = new Date().getFullYear();

  return {date, subscribe, handleSubmit, error, errors, success, loading, register}
};

export default subscribeValidator