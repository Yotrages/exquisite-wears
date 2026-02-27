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
  const { id } = useParams();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState({
    name: '',
    image: '',
    description: '',
    quantity: 0,
    price: 0,
    originalPrice: 0,
    discount: 0,
    brand: '',
    _id: '',
    category: '',
    sku: '',
    tags: [] as string[],
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<postProduct>({ resolver: zodResolver(productSchema) });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const product = (formData: postProduct) => {
    const sendProduct = async () => {
      if (!token) {
        setError("You are not authenticated, please login");
        toast.error("Please login to edit products");
        navigate('/login');
        return;
      }

      const data = new FormData();
      if (formData.image && formData.image[0]) {
        data.append("image", formData.image[0]);
      }
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      data.append("quantity", formData.quantity.toString());
      data.append("category", formData.category || "");
      data.append("sku", formData.sku || "");

      // ✅ New fields: discount, brand, originalPrice
      if (typeof formData.discount === 'number') {
        data.append("discount", formData.discount.toString());
      }
      if (formData.brand) {
        data.append("brand", formData.brand);
      }
      if (typeof formData.originalPrice === 'number' && formData.originalPrice > 0) {
        data.append("originalPrice", formData.originalPrice.toString());
      }

      if (formData.tags) {
        // Handle tags: can be array or comma-separated string from input
        const tagsArray = Array.isArray(formData.tags)
          ? formData.tags
          : String(formData.tags).split(',').map((t: string) => t.trim()).filter(Boolean);
        data.append("tags", JSON.stringify(tagsArray));
      }
      if (typeof formData.inStock !== 'undefined') {
        data.append('inStock', formData.inStock ? 'true' : 'false');
      }

      setLoading(true);
      try {
        const res = await apiClient.put<ProductUpdateResponse>(`/products/put/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 200) {
          setSuccess("Product updated successfully");
          toast.success("Product updated successfully");
          if (res.data.product) {
            const p = res.data.product;
            setProducts({
              name: p.name,
              image: p.image,
              description: p.description,
              quantity: p.quantity,
              price: p.price,
              originalPrice: p.originalPrice || 0,
              discount: p.discount || 0,
              brand: p.brand || '',
              _id: p._id,
              category: p.category || '',
              sku: p.sku || '',
              tags: p.tags || [],
            });
          }
          setTimeout(() => setSuccess(""), 3000);
          navigate('/admin/products');
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update product';
        setError(errorMsg);
        toast.error(errorMsg);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setTimeout(() => navigate('/login'), 2000);
        }
        setTimeout(() => setError(""), 5000);
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
        const res = await apiClient.get<{ product: ProductResponse }>(`/products/get/${id}`);
        const data = res.data.product;
        setProducts({
          name: data.name,
          image: data.image,
          description: data.description,
          quantity: data.quantity,
          price: data.price,
          originalPrice: (data as any).originalPrice || 0,
          discount: (data as any).discount || 0,
          brand: (data as any).brand || '',
          _id: data._id,
          category: data.category || '',
          sku: data.sku || '',
          tags: data.tags || [],
        });
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("quantity", data.quantity);
        setValue("inStock", typeof data.inStock !== 'undefined' ? data.inStock : data.quantity > 0);
        setValue("category", data.category || "");
        setValue("sku", data.sku || "");
        setValue("discount", (data as any).discount || 0);
        setValue("brand", (data as any).brand || "");
        if ((data as any).originalPrice) setValue("originalPrice", (data as any).originalPrice);
        if (data.tags && data.tags.length > 0) setValue("tags", data.tags);
        setImagePreview(data.image);
      } catch (error: any) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
      }
    };
    getProducts();
  }, [id, setValue]);

  return { success, error, errors, handleImageChange, handleSubmit, imagePreview, product, products, register, loading };
};

export default EditValidator;
