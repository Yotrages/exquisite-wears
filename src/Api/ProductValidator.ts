import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "./Endpoint";


interface Product {
  image: string;
  name: string;
  price: number;
  quantity: number;
  _id: string
}

interface ApiResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const useProductValidator = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<
    {
      image?: string;
      name?: string;
      price?: number;
      quantity?: number;
      _id: string;
      description?: string;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
    const [success, setSuccess] = useState('')
    const limit : number = 15
    const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    getProducts(currentPage)
  }, [currentPage]);

  const getProducts = async (page: number): Promise<void> => {
    try {
      const url = `${URL}/products/get?page=${page}&limit=${limit}`;
      const res = await axios.get<ApiResponse>(url, {
        headers: { "Cache-Control": "no-cache" },
      });
      const { products, totalPages } = res.data;
      setProducts(products);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };
  


  const deletePost = async (id: string) => {
    try {
      const res = await axios.delete(`${URL}/products/delete/${id}`, {
        headers: { "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",}
      })
      const data =  res.data
      console.log(data)

      if (res.status === 200) {
        setSuccess('Product deleted successfully')
       setTimeout(() => setSuccess(''), 3000)
        getProducts(currentPage)
      }
    } catch (error : any) {
      if (error.response) {
        setError(error.response.data.message)
      } else if (error.request) {
        setError('Server error, check your connection')
      } else {
        setError('An unknown error occurred')
      }
    }
    setTimeout(() => setError(""), 3000)
  }

  const token = localStorage.getItem("admin");
  const notAdmin = "true";


const handleEdit = (id: string | undefined) => {
  navigate(`/edit/${id}`);
};

return { handleEdit, token, notAdmin, deletePost, getProducts, setCurrentPage, totalPages, success, error, products, currentPage}
}

export default useProductValidator;