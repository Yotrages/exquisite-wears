import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotificationSchema } from "../Schema/Notification";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { URL } from "./AdminApi";


 const AllNotifications  = () => {
  type Notifications = z.infer<typeof NotificationSchema>;
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

  useEffect(() => {});

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
          setTimeout(() => setSuccess(""), 3000);
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
  }
}

export default AllNotifications