import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "./axiosConfig";
import { Product } from "../Types/Product";
import { ProductListResponse, ProductDeleteResponse } from "./ApiResponses";
import toast from "react-hot-toast";

const useProductValidator = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: any) => state.authSlice);
  const token = authState?.token || null;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [success, setSuccess] = useState("");
  const limit: number = 15;
  const [error, setError] = useState<null | string>(null);
  
  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage, navigator.onLine]);

  const getProducts = async (page: number): Promise<void> => {
    try {
      const res = await apiClient.get<ProductListResponse>(
        `/products/get?page=${page}&limit=${limit}`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const { products, totalPages } = res.data;
      setProducts(products);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    }
  };

  const deletePost = async (id: string) => {
    if (!token) {
      toast.error("You must be authenticated to delete products");
      return;
    }

    try {
      const res = await apiClient.delete<ProductDeleteResponse>(
        `/products/delete/${id}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (res.status === 200) {
        setSuccess("Product deleted successfully");
        toast.success("Product deleted");
        setTimeout(() => setSuccess(""), 3000);
        getProducts(currentPage);
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error.response) {
        const errorMsg = error.response.data.message || error.response.data.error;
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (error.request) {
        setError("Server error, check your connection");
        toast.error("Server error");
      } else {
        setError("An unknown error occurred");
        toast.error("Failed to delete product");
      }
    }
    setTimeout(() => setError(""), 5000);
  };

  const handleEdit = (id: string | undefined) => {
    navigate(`/edit/${id}`);
  };

  return {
    handleEdit,
    token,
    deletePost,
    getProducts,
    setCurrentPage,
    totalPages,
    success,
    error,
    products,
    currentPage,
  };
};

export default useProductValidator;
