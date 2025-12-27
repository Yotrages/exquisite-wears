import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postProduct, productSchema } from "../Schema/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiClient from "./axiosConfig";
import { ProductUpdateResponse, ProductResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const EditValidator = () => {
    const { id } = useParams()
    const authState = useSelector((state: any) => state.authSlice);
    const token = authState?.token || null;
    
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate()
    const [products, setProducts] = useState({
      name: '',
      image: '',
      description: '',
      quantity: 0,
      price: 0,
      _id: '',
      category: '',
      sku: '',
      tags: [] as string[],
    });
    
    const {
      handleSubmit,
      formState: { errors },
      register,
      setValue
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
  
  
    const product = (product: postProduct) => {
      const sendProduct = async () => {
        if (!token) {
          setError("You are not authenticated, please login");
          toast.error("Please login to edit products");
          setTimeout(() => setError(""), 3000)
          navigate('/login')
          return;
        }

        const formData = new FormData();
        if (product.image && product.image[0]) {
          formData.append("image", product.image[0]); 
        }
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price.toString());
        formData.append("quantity", product.quantity.toString());
        formData.append("category", product.category || "");
        formData.append("sku", product.sku || "");
        if (product.tags) {
          formData.append("tags", JSON.stringify(product.tags));
        }
        if (typeof product.inStock !== 'undefined') {
          formData.append('inStock', product.inStock ? 'true' : 'false');
        }
    
        setLoading(true);
        try {
          const res = await apiClient.put<ProductUpdateResponse>(`/products/put/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (res.status === 200) {
            setLoading(false)
            setSuccess("Product updated successfully");
            toast.success("Product updated successfully");
            if (res.data.product) {
              const product = res.data.product;
              setProducts({
                name: product.name,
                image: product.image,
                description: product.description,
                quantity: product.quantity,
                price: product.price,
                _id: product._id,
                category: product.category || '',
                sku: product.sku || '',
                tags: product.tags || [],
              });
            }
            setTimeout(() => setSuccess(""), 3000)
            navigate('/')
          }
        } catch (error: any) {
          console.error(error.message);
          const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update product';
          setError(errorMsg);
          toast.error(errorMsg);
          
          if (error.response?.status === 401 || error.response?.status === 403) {
            setTimeout(() => navigate('/login'), 2000)
          }
          
          setTimeout(() => setError(""), 5000)
        } finally {
          setLoading(false);
        }
      };
      sendProduct();
    };
  
    useEffect(() => {
      const getProducts = async () => {
        if (!id) return; 
        try {
          const res = await apiClient.get<{product: ProductResponse}>(`/products/get/${id}`);
          const data = res.data.product; 
          setProducts({
            name: data.name,
            image: data.image,
            description: data.description,
            quantity: data.quantity,
            price: data.price,
            _id: data._id,
            category: data.category || '',
            sku: data.sku || '',
            tags: data.tags || [],
          });
          setValue("name", data.name);
          setValue("description", data.description);
          setValue("price", data.price);
          setValue("quantity", data.quantity);
          setValue("inStock", typeof data.inStock !== 'undefined' ? data.inStock : (data.quantity > 0));
          setValue("category", data.category || "");
          setValue("sku", data.sku || "");
          if (data.tags && data.tags.length > 0) {
            setValue("tags", data.tags);
          }
          setImagePreview(data.image); 
        } catch (error: any) {
          console.error("Error loading product:", error);
          toast.error("Failed to load product");
        }
      };
      getProducts();
    }, [id, setValue]);

    return { success, error, errors, handleImageChange, handleSubmit, imagePreview, product, products, register, loading }
}

export default EditValidator