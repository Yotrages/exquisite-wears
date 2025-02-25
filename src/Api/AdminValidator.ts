import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postProduct, productSchema } from "../Schema/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { URL } from "./Endpoint";

const AdminValidator = () => {
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<postProduct>({ resolver: zodResolver(productSchema) });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  };


  const products = (product: postProduct) => {
    const sendProduct = async () => {
      const formData = new FormData();
      formData.append("image", product.image[0]); 
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("quantity", product.quantity.toString());
      console.log(product.image[0]);
  
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("You are not authenticated, please login");
        setTimeout(() => setError(""), 3000)
        return;
      }
  
      setLoading(true);
      try {
        const res = await axios.post(`${URL}/products/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 201) {
          setLoading(false)
          setSuccess("Product posted successfully");
          setTimeout(() => setSuccess(''), 3000)
          reset();
          setImagePreview(null)
          setShow(true)     
        }
      } catch (error: any) {
        console.error(error.message);
        if (error.response) {
          setError(error.response.data.message || error.response.data.error)
          if (error.response?.status === 400 || 403 || 401) {
            setError(error.response.data.error)
            localStorage.removeItem('adminToken')
            setTimeout(() => navigate('/login'), 2000)
          }
        }
          else if (error.request) {
            setError(`Can't connect to the server, check your connection`)
          } else {
            setError('An unknown error occurred')
          }
          setTimeout(() => setError(""), 3000)
          clearTimeout(3000)
          setLoading(false)
      }
    };
    sendProduct();
};
return {error, errors, success, loading, handleImageChange, handleSubmit, imagePreview, show, navigate, register, products, setShow}
}

  export default AdminValidator