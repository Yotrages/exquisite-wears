import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ContactForm, contactSchema } from "../Schema/ContactSchema";
import { useState } from "react";
import axios from "axios";
import { URL } from "./Endpoint";

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
            console.log("Sending data:", Contactdata);
            const res = await axios.post(`${URL}/contact`, Contactdata);
    
            if (res.status === 200) {
              console.log("Response:", res);
              setLoading(false);
              setSucess("Message delivered successfully");
              reset();
             setTimeout(() => setSucess(""), 3000)
            } else {
              setLoading(false)
            }
          } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
              setError(error.response.data.message || "An error occurred");
            } else if (error.request) {
              setError("No response from server, check your connection and try again");
            } else {
              setError(error.message || "An error occurred");
            }
            setLoading(false);
            setTimeout(() => setError(""), 3000)
            clearTimeout(3000)
          }
        };
        loginUser();
      };
      return { handleSubmit, success, submission, error, errors, loading, register}
}

export default ContactValidator