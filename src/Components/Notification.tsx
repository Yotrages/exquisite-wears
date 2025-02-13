import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotificationSchema } from "../Schema/Notification";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { URL } from "../Api/AdminApi";
import { FaSpinner } from "react-icons/fa";

type Notifications = z.infer<typeof NotificationSchema>;
const Notification = () => {
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
  };

  return (
    <section className="py-10 mt-10 w-full">
      {error && (
        <div className="bg-red-700 items-center justify-center flex fixed top-9 right-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-600 items-center justify-center flex fixed top-9 right-6">
          {success}
        </div>
      )}
      <h1 className="sm:text-5xl text-3xl font-poppins text-primary tracking-wider font-extrabold text-center mb-14">
        Notify all users
      </h1>
      <form
        onSubmit={handleSubmit(Notify)}
        className="flex items-center gap-8 flex-col w-full px-3 qy:w-2/3 xl:w-2/6 m-auto"
      >
        <div className="flex flex-col w-full items-start gap-5">
          <label className="text-xl font-bold" htmlFor="subject" id="subject">
            Subject
          </label>
          <input
            type="text"
            {...register("subject")}
            id="subject"
            className="w-full py-2 focus:outline-none px-3 rounded-lg flex border border-green-400 hover:border-yellow-400"
          />
          {errors.subject && (
            <p className="text-red-700">{errors.subject.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full items-start gap-5">
          <label className="text-xl font-bold" htmlFor="message" id="message">
            Message
          </label>
          <textarea
            {...register("subject")}
            id="subject"
            className="w-full px-3 focus:outline-none py-3 rounded-lg flex border border-green-400 hover:border-yellow-400"
          />
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>
        <button
          className="bg-white rounded-full transition-all duration-500  hover:skew-x-6 hover:scale-110 bg-shadow orange_gradient px-4 py-3 text-center items-center justify-center flex gap-4"
          type="submit"
        >
          {loading ? (
            <span>
              <FaSpinner className="text-lg" />
              Send Message
            </span>
          ) : (
            <span>Send Message</span>
          )}
        </button>
      </form>
    </section>
  );
};

export default Notification;
