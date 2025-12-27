import { useState } from "react";
import { Notifications, NotificationSchema } from "../Schema/Notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import apiClient from "./axiosConfig";
import { NotificationResponse } from "./ApiResponses";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ConnectToBe = () => {
  const {
    formState: { errors },
    reset,
    handleSubmit,
    register,
  } = useForm<Notifications>({ resolver: zodResolver(NotificationSchema) });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const Notify = (items: Notifications) => {
    const sendNotification = async () => {
      setLoading(true);
      try {
        const res = await apiClient.post<NotificationResponse>(`/subscribe/notify`, items);
        if (res.status === 200) {
          setLoading(false);
          setSuccess("All users are Notified successfully");
          toast.success("Notification sent successfully");
          reset();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setShow(true)
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to send notification";
        setError(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => setError(""), 5000);
      } finally {
        setLoading(false);
      }
    };
    sendNotification();
  };

  return { errors, handleSubmit, register, success, error, loading, Notify, show, setShow, navigate };
};

export default ConnectToBe;
