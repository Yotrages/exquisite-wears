import { useState } from "react";
import { useForm } from "react-hook-form";
import { SubSchema, SubscribeForm } from "../Schema/SubscribeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { URL } from "./Endpoint";

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
        const res = await axios.post(`${URL}/subscribe`, email);
        console.log(res.data);

        if (res.status === 201) {
          setLoading(false);
          setSuccess("Subscription Successful");
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
          setError("Something went wrong");
        }
      }
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      clearTimeout(3000);
    };
    subscription();
  };
  const date = new Date().getFullYear();

  return {date, subscribe, handleSubmit, error, errors, success, loading, register}
};

export default subscribeValidator