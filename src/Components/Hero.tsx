import { Link } from "react-router-dom";
import { bg4, social } from "../assets";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  image: string;
  quantity: string;
}

const Hero = () => {
  const URL = "https://ecommerce-9wqc.onrender.com/api/products/get";
  const [products, setProducts] = useState<Product[]>([]);
  

  const getLast = products[0]?.image ?? social;


  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(URL);
        const data: Product[] = res.data.products;

        setProducts(data);
       
        const quantities = data.map((item) => item.quantity);
        localStorage.setItem("quantity", JSON.stringify(quantities));
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
      }
    };
    getProducts();
  }, [getLast]);

  const token = localStorage.getItem("admin");
  const Admin = "true";
  const user = localStorage.getItem("userName");

  

  return (
    <section className={`w-full`}>
      <div className="relative w-full">
        {/* Background Image */}
        <img
          src={bg4}
          className="absolute w-full h-full object-cover"
          alt="Background"
        />
        
        <div className="relative flex flex-col sm:py-28 md:py-40 py-10 md:flex-row gap-10 md:justify-between items-center md:items-start w-full md:h-full px-8 xl:px-12 md:px-14">
          <div className="flex flex-col md:items-start items-center gap-8 qy:gap-14 md:w-1/2 text-center md:text-left">
            <h1 className="xs:text-4xl text-3xl md:text-5xl font-bold text-white tracking-wide">
              Let's help you look and feel Elegant and confident 
            </h1>
            <span className="flex flex-col gap-2">
              <h2 className="xs:text-2xl text-lg md:text-2xl tracking-wide text-white">
               The Exquisite Wears, where perfect fits meet timeless accessories.
              </h2>
              <h2 className="xs:text-2xl text-lg md:text-2xl tracking-wide text-white">
              We provide Custom-tailored dresses and high quality fashion accessories that enhance confidence, elegance and individuality.
              </h2>
            </span>

            {/* Conditional Button */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                to={token === Admin ? '/admin' : user ? '#subscribe' : '/register'}
                className="inline-flex items-center gap-3 px-6 py-3 bg-black-gradient text-white rounded-md shadow-md transition-transform hover:scale-105 w-fit"
                id="subscribe"
              >
                <button className="font-semibold text-lg">
                  {token === Admin ? "Create Post" : user ? 'Subscribe' : 'Get started' }
                </button>
                <FaArrowAltCircleRight />
              </Link>
                         {token === Admin && (
               <Link className="inline-flex items-center gap-3 px-6 py-3 bg-black-gradient text-white rounded-md shadow-md transition-transform hover:scale-105 w-fit"  to='/notification'>
                <button className="font-semibold text-lg">
                 Notify Users
                </button>
                <FaArrowAltCircleRight />
               </Link>
                         )}
            </div>
          </div>

          {/* Product Image */}
          <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
            <img
              src={getLast}
              className="w-full max-w-lg h-auto object-cover rounded-md shadow-lg"
              alt="Latest Product"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
