import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

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
const Feeds = () => {
  const URL = "https://ecommerce-9wqc.onrender.com/api/products";
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
    const [message, setMessage] = useState('')
    const limit : number = 15
    const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    getProducts(currentPage)
  }, [currentPage, products]);

  const getProducts = async (page: number): Promise<void> => {
    try {
      const url = `${URL}/get?page=${page}&limit=${limit}`;
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
      const res = await axios.delete(`${URL}/delete/${id}`, {
        headers: { "Cache-Control": "no-cache",
          "Pragma": "no-cache",
          "Expires": "0",}
      })
      const data =  res.data
      console.log(data)

      if (res.status === 200) {
        setMessage('Product deleted successfully')
       setTimeout(() => setMessage(''), 3000)
        setProducts((products) => products.filter((item) => item._id !== id))
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
    clearTimeout(3000)
  }

  const token = localStorage.getItem("admin");
  const notAdmin = "true";


const handleEdit = (id: string | undefined) => {
  navigate(`/edit/${id}`);
};


  return (
    <section className="py-20">
      {error && (
          <div className="bg-red-600 rounded-lg text-white fixed top-5 z-10 right-5 text-center px-4 py-3">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-600 rounded-lg text-white fixed top-5 z-10 right-5 text-center px-4 py-3">
            {message}
          </div>
        )}
      <div className="grid qy:grid-cols-3 md:grid-cols-4 grid-cols-2 sm:w-[88%] w-full sm:px-0 px-3 m-auto items-center gap-5">
        {products.length > 0 &&
          products.map((item) => (
            <div
              key={item?._id}
              className="flex flex-col h-fit mr-8 p-image bg-shadow rounded-lg hover:scale-110 transition-all duration-500 bg-white gap-4 mb-6 pb-3"
            >
              <img
                className="w-full h-fit object-cover aspect-square rounded-lg"
                src={item?.image || "default-placeholder-image.jpg"}
                alt={item?.name}
              />
              <div className="flex flex-col  flex-wrap gap-3 px-4">
                <h1 className="text-primary mb-2 header  tracking-wide font-light font-poppins">
                  {item?.name}
                </h1>
                <h1 className="text-primary header text-wrap tracking-wide font-light font-poppins">
                  {item?.description}
                </h1>
                <p className="orange_gradient font-poppins font-semibold tracking-wide">
                  ${item?.price}
                </p>
                <Button onSmash={() => console.log('pressed')} styles="rounded-lg text-white hover:bg-green-500 text-center" buttonText="Discuss product" router="https://wa.me/08145534450"/>
              </div>
              {token === notAdmin && (
                <div className="flex w-full px-4 justify-between h-fit sm:flex-row flex-col items-start sm:items-center gap-2">
                  <button 
                    type="submit"
                    onClick={() => handleEdit(item._id)}
                    className="rounded-lg  gap-4 py-2 px-3 bg-black-gradient bg-shadow text-white font-semibold tracking-widest"
                  >Edit</button>
                  <button
                    type="submit"
                    onClick={() => deletePost(item._id)}
                    className="rounded-lg py-2 px-3 bg-red-500 bg-shadow text-white font-semibold tracking-widest"
                  >Delete</button>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="flex flex-row w-full items-center justify-center pt-5 gap-4">
        <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1} className="bg-black rounded-full cursor-pointer px-4 py-2 text-white text-center">Previous</button>
        <span className="bg-black text-white flex items-center justify-center font-poppins text-lg rounded-full size-10 text-center">
          {currentPage}
        </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages} className="bg-black px-4 py-2 rounded-full w-fit text-white text-center">Next</button>
      </div>
    </section>
  );
};

export default Feeds;
