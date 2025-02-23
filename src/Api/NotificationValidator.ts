import { useState } from "react";
import { Notifications, NotificationSchema } from "../Schema/Notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { URL } from "./Endpoint";

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
  const token = localStorage.getItem("adminToken");

  const Notify = (items: Notifications) => {
    const sendNotification = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${URL}/notify`, items, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 201) {
          setLoading(false);
          setSuccess("All users are Notified successfully");
          reset();
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (error: any) {
        console.error(error);
        if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          setError("Server not responding, check your connection");
        } else {
          setError("An unknown error occurred");
        }
        setTimeout(() => setError(""), 3000);
        clearTimeout(3000);
      } finally {
        setLoading(false);
      }
    };
    sendNotification();
  };

  return { errors, handleSubmit, register, success, error, loading, Notify };
};

export default ConnectToBe;
