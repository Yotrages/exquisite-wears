import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { postProduct, productSchema } from "../Schema/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import apiClient from "./axiosConfig";
import { ProductCreateResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const AdminValidator = () => {
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;
  
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
      if (!token) {
        setError("You are not authenticated, please login");
        toast.error("Please login to add products");
        setTimeout(() => setError(""), 3000)
        return;
      }

      const formData = new FormData();
      formData.append("image", product.image[0]); 
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("quantity", product.quantity.toString());

      if (product.originalPrice !== undefined && product.originalPrice !== null) {
        formData.append("originalPrice", product.originalPrice.toString());
      }

      if (product.discount !== undefined && product.discount !== null) {
        formData.append("discount", product.discount.toString());
      }

      if (product.brand) {
        formData.append('brand', product.brand);
      }

      if (product.specifications) {
        formData.append('specifications', typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications));
      }

      if (product.seller) {
        formData.append('seller', typeof product.seller === 'string' ? product.seller : JSON.stringify(product.seller));
      }

      setLoading(true);
      try {
        const res = await apiClient.post<ProductCreateResponse>(`/products/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) {
          setLoading(false)
          setSuccess("Product posted successfully");
          toast.success("Product posted successfully");
          setTimeout(() => setSuccess(''), 3000)
          reset();
          setShow(true)     
          setImagePreview(null)
        }
      } catch (error: any) {
        console.error(error.message);
        const errorMsg = error.response?.data?.message || 'Failed to post product';
        setError(errorMsg);
        toast.error(errorMsg);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setTimeout(() => navigate('/login'), 2000)
        }
        
        setTimeout(() => setError(""), 5000)
        setLoading(false)
      }
    };
    sendProduct();
};
return {error, errors, success, loading, handleImageChange, handleSubmit, imagePreview, show, navigate, register, products, setShow}
}

  export default AdminValidator;