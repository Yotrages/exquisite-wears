import axios from "axios";
import { useEffect, useState } from "react";
import { postProduct, productSchema } from "../Schema/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { URL } from "./Endpoint";

const EditValidator = () => {
    const { id } = useParams()
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
        _id: ''
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
          const formData = new FormData();
          formData.append("image", product.image[0]); 
          formData.append("name", product.name);
          formData.append("description", product.description);
          formData.append("price", product.price.toString());
          formData.append("quantity", product.quantity.toString());
          console.log(product.image[0]);
      
          const token = localStorage.getItem("adminToken");
          console.log(token)
          if (!token) {
            setError("You are not authenticated, please login");
            setTimeout(() => setError(""), 3000)
            navigate('/login')
            return;
          }
      
          setLoading(true);
          try {
            const res = await axios.put(`${URL}/products/put/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, 
              },
            });
            const data = await res.data;
            console.log(data)
            if (res.status === 200) {
              setLoading(false)
              setSuccess("Product updated successfully");
              setProducts(data.product)
              setTimeout(() => setSuccess(""), 3000)
              navigate('/')
            }
          } catch (error: any) {
            console.error(error.message);
              if(error.response) {
                setError(error.response.data.message)
              } else if (error.request) {
                setError(`Can't connect to the server, check your connection`)
              } else {
                setError('An unknown error occurred')
              }
              setTimeout(() => setError(""), 3000)
              clearTimeout(3000)
          } finally {
            setLoading(false);
          }
        };
        sendProduct();
      };
    
      useEffect(() => {
        const getProducts = async () => {
          if (!id) return; // Ensure there's an ID before fetching
          try {
            const res = await axios.get(`${URL}/get/${id}`);
            const data = res.data.product; // Adjust according to your API response
            console.log(data);
            setProducts(data);
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("price", data.price);
            setValue("quantity", data.quantity);
            setImagePreview(data.image); // Set preview image
          } catch (error: any) {
            console.error(error);
          }
        };
        getProducts();
      }, [id, setValue]);

      return { success, error, errors, handleImageChange, handleSubmit, imagePreview, product, products, register, loading }
}

export default EditValidator