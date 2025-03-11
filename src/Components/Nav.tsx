import { FaArrowDown, FaSearch } from "react-icons/fa";
import { Nigeria } from "../assets";
import React from "react";
import { CgMenuGridO } from "react-icons/cg";
import { Link, useNavigate} from "react-router-dom";
import Logout from "./Logout";
import { handleLogout } from "../constants";
import SearchValidator from "../Api/Search";
import SearchInput from "./SearchInput";
import Sidebar from "./Sidebar";
const Nav = ({
  change,
  setChange,
}: {
  change: Boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    handleSearchToggle,
    setSearchTerm,
    searchTerm,
    searchToggle,
    handleSearch,
    data,
    userName,
    error,
    user,
    setToggle,
    setSearchToggle,
    toggle,
  } = SearchValidator();
  setChange(() => searchToggle);
  const navigate = useNavigate()

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`w-full flex top-0  justify-between ${
          searchToggle && change
            ? "translate-x-[w-full] z-[1] overflow-hidden"
            : "fixed top-0 py-4 z-[10]"
        } items-center sm:px-8 xs:px-5 px-3 bg-[#f2f2f2] bg-shadow text-black ${
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 px-3 focus:ring-gray-500 focus:outline-none ring ring-primary rounded-lg text-black xl:w-[550px] sm:w-[400px]"
              placeholder="Search products..."
              name="input"
            />
            <div
              className="absolute bg-gray-200 h-full rounded-lg px-4 right-0 flex items-center"
              onClick={() => handleSearch(searchTerm)}
            >
              <FaSearch className="text-black" />
            </div>
          </div>

          {/* Display Search Results */}
          {(data.length > 0 || error) && (
            <ul className="absolute md:flex flex-col hidden max-h-[85vh] top-full left-0 w-full bg-white text-black z-[1] overflow-y-auto shadow-md px-3 py-1 rounded-md">
              {data.map((item, index) => (
                <li
                  key={index}
                  className="py-3 flex flex-row min-h-fit cursor-pointer items-center w-full justify-between border-b"
                  onClick={() => handleSearch(item.name)}
                >
                  <div>
                    <img
                      src={item.image}
                      alt=""
                      className="size-16 object-contain"
                    />
                  </div>
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
            <button className="bg-gray-500 items-center size-7 text-center xs:size-9 rounded-full xs:text-[22px] font-semibold justify-center flex text-white">
              <p className="text-center">{userName}</p>
            </button>
            {/* <div className="relative items-center">
              <FaShoppingCart className="xs:text-[25px] text-[20px]" />
              <button className="xs:size-5 text-[12px] xs:text-[16px] size-4 rounded-full items-center justify-center flex bg-gray-600 text-white absolute bottom-3 left-3 xs:left-4">0</button>
            </div> */}
            <Logout styles="" onsmash={() => handleLogout(navigate)} />
          </div>
        ) : (
          <div className="relative flex items-center xs:gap-8 gap-7">
            <FaSearch
              className="md:hidden cursor-pointer text-[18px]"
              onClick={handleSearchToggle}
            />
            <Link
              to="/register"
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

            <CgMenuGridO
              className="text-black size-9 cursor-pointer ss:hidden flex hover:scale-105"
              onClick={() => setToggle((prev) => !prev)}
            />

            {/* <div className="relative items-center">
              <FaShoppingCart className="text-[25px]" />
              <button className="size-5 rounded-full items-center justify-center flex bg-gray-600 text-white absolute bottom-3 left-4">0</button>
            </div> */}
          </div>
        )}
      </nav>

      <Sidebar toggle={toggle} setToggle={setToggle} />

      {/* Mobile Search */}
      <SearchInput
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        searchToggle={searchToggle}
        setSearchTerm={setSearchTerm}
        data={data}
        error={error}
        setSearchToggle={setSearchToggle}
      />
    </>
  );
};

export default Nav;
