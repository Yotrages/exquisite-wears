import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ContactForm, contactSchema } from "../Schema/ContactSchema";
import { useState } from "react";
import apiClient from "./axiosConfig";
import { ContactResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const ContactValidator = () => {
    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
      } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [success, setSucess] = useState(String);
    
      const submission = (Contactdata: ContactForm) => {
        const loginUser = async () => {
          setLoading(true);
          try {
            const res = await apiClient.post<ContactResponse>(`/contact`, Contactdata);
    
            if (res.status === 200) {
              setLoading(false);
              setSucess("Message delivered successfully");
              toast.success("Message sent successfully");
              reset();
              setTimeout(() => setSucess(""), 3000)
            }
          } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to send message";
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
            setTimeout(() => setError(""), 5000)
          }
        };
        loginUser();
      };
      return { handleSubmit, success, submission, error, errors, loading, register}
}

export default ContactValidator