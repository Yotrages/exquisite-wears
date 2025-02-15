import { FaArrowDown, FaSearch } from "react-icons/fa";
import { close, Nigeria } from "../assets";
import React, { useState, useEffect } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";



const Nav = ({change, setChange} : {change: Boolean, setChange: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();
  const [searchToggle, setSearchToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<{ name: string, image: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toggle, setToggle] = useState(false)

  setChange(() => searchToggle)

  const URL = "https://ecommerce-9wqc.onrender.com/api/products/search";
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setData([]);
        setError(null);
        return;
      }

      try {
        const response = await axios.get(`${URL}?query=${searchTerm}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setData([]);
        if (err.response) {
          setError(err.response.data.message || "No items match your search.");
        } else if (err.request) {
          setError("Server is not responding. Check your connection.");
        } else {
          setError("An error occurred.");
        }
      }
    };
    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchToggle = () => {
    setSearchToggle((prev) => !prev);
  };

  

  const handleLogout = () => {
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    if (
      window.location.pathname !== "http://localhost:5173/Admin" ||
      "http://localhost:5173/Dashboard"
    ) {
      window.location.reload();
      return;
    }
    navigate("/login");
  };

  const handleSearch = () => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyZ") {
        console.log("pressed");
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setSearchToggle(false)
    })
  })

  const user = localStorage.getItem("userName");
  const userName = user?.charAt(0).toUpperCase();

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`w-full flex top-0  justify-between ${searchToggle && change ? 'translate-x-[w-full] z-[1] overflow-hidden' : 'fixed top-0 py-4 z-[10]'} items-center sm:px-8 xs:px-5 px-3 bg-[#f2f2f2] bg-shadow text-black ${
          user ? "pt-5" : "pt-4"
        } `}
      >
        <Link to="/">
          <span className="flex items-center qy:text-[28px] text-[18px]">
            <h1 className="text-[#001F3F] font-bold tracking-widest">
              Exquisite
            </h1>
            <h1 className="text-[#001F3F] font-bold tracking-widest">Wears</h1>
          </span>
        </Link>

        {/* Search Form */}
        <div className="inline-block relative">
          <div className="md:flex relative hidden">
            <input
              type="search"
              onKeyDown={() => handleSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 px-3 focus:outline-black outline-dashed outline-gray-500 rounded-lg text-black xl:w-[550px] sm:w-[400px]"
              placeholder="Search products..."
              name="input"
            />
            <div className="absolute bg-gray-200 h-full rounded-lg px-4 right-0 flex items-center">
              <FaSearch className="text-black" />
            </div>
          </div>

          {/* Display Search Results */}
          {(data.length > 0 || error) && (
              <ul className="absolute md:flex flex-col hidden h-[85%] top-full left-0 w-full bg-white text-black z-[1] overflow-y-scroll shadow-md px-3 py-1 rounded-md">
                {data.map((item, index) => (
                  <li key={index} className="py-3 flex flex-row min-h-fit items-center w-full justify-between border-b">
                    <div className=""><img src={item.image} alt="" className="size-16 object-contain"/></div>
                    <div>{item.name}</div>
                  </li>
                ))}
                {error && <li className="py-2 text-red-500">{error}</li>}
              </ul>
          )}
        </div>
        {/* Desktop and Mobile Nav */}
        {user ? (
          <div className="flex items-center xs:gap-7 gap-3">
            <div className="hidden xl:flex items-center gap-1">
              <img
                className="max-w-[25px] align-baseline"
                src={Nigeria}
                alt="Ngn logo"
              />
              <h1 className="text-[18px]">NGN</h1>
              <FaArrowDown />
            </div>
            <FaSearch
              className="md:hidden cursor-pointer"
              onClick={handleSearchToggle}
            />
            <button className="bg-gray-500 items-center size-7 xs:size-9 rounded-full xs:text-[22px] font-semibold justify-center flex text-white">
              <p>{userName}</p>
            </button>
            {/* <div className="relative items-center">
              <FaShoppingCart className="xs:text-[25px] text-[20px]" />
              <button className="xs:size-5 text-[12px] xs:text-[16px] size-4 rounded-full items-center justify-center flex bg-gray-600 text-white absolute bottom-3 left-3 xs:left-4">0</button>
            </div> */}
            <Logout styles="" onsmash={handleLogout} />
          </div>
        ) : (
          <div className="relative flex items-center xs:gap-8 gap-7">
            <FaSearch
              className="md:hidden cursor-pointer text-[18px]"
              onClick={handleSearchToggle}
            />
            <Link
              to="/Register"
              className="px-2 ss:flex hidden py-2 hover:scale-110 transition duration-500 ease-in-out items-start justify-center rounded-lg bg-primary text-white "
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-2 ss:flex hidden py-2 hover:scale-110 transition duration-500 ease-in-out  items-start justify-center rounded-lg bg-primary text-white "
            >
              Login
            </Link>

             <CgMenuGridO className="text-black size-9 cursor-pointer ss:hidden flex hover:scale-105" onClick={() => setToggle((prev) => (!prev))}/>
            


            {/* <div className="relative items-center">
              <FaShoppingCart className="text-[25px]" />
              <button className="size-5 rounded-full items-center justify-center flex bg-gray-600 text-white absolute bottom-3 left-4">0</button>
            </div> */}
          </div>
        )}
      </nav>

             
                <div className={`text-black transition-all duration-500 ease-in fixed top-0 right-0 py-3 bg-white bg-shadow flex flex-col h-full gap-5 z-[10] overflow-x-hidden ${toggle ? 'w-[250px] opacity-100' : 'w-0 opacity-0'}`} onClick={() => setToggle((prev) => (!prev))}>
                  <div className="flex items-end justify-end px-3"><IoMdClose className="text-black size-10 hover:scale-105" /></div>
                  <ul className="flex flex-col gap-3 px-3">
                    <Link className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 " to='/'>Home</Link>
                    <Link className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 " to='/About'>About</Link>
                    <Link className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 " to='/Login'>Login</Link>
                    <Link className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 " to='/Register'>Register</Link>
                  </ul>
              
                </div>

      {/* Mobile Search */}
      {searchToggle && (
  <div className="fixed top-0 w-full py-3 px-5 bg-black z-[1] flex items-center gap-5 justify-between">
    
    {/* Search Bar */}
    <div className="relative w-full">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-3 px-3 rounded-lg text-black outline-none focus:ring focus:ring-red-200"
        placeholder="Search products..."
      />
      <div className="absolute right-0 top-0 h-full flex items-center px-4 bg-gray-200 rounded-lg">
        <FaSearch className="text-black" />
      </div>

      {/* Search Results */}
      {(data.length > 0 || error) && (
        <ul className="absolute top-full left-0 w-full bg-white text-black overflow-y-scroll z-10 shadow-md rounded-lg px-3">
          {data.map((item, index) => (
            <li key={index} className="py-2 flex items-center justify-between border-b">
              <img src={item.image} alt="product image" className="w-10 h-10 flex object-cover rounded-md" />
              <span className="text-right">{item.name}</span>
            </li>
          ))}
          {error && <li className="py-2 text-red-500">{error}</li>}
        </ul>
      )}
    </div>

    {/* Close Button */}
    <img
      src={close}
      alt="Close search"
      className="cursor-pointer w-6 h-6"
      onClick={() => {
        setSearchToggle(false);
        setSearchTerm("");
      }}
    />
  </div>
)}

    </>
  );
};

export default Nav;

