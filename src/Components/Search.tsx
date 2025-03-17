import axios from "axios";
import { useParams } from "react-router-dom";
import { URL } from "../Api/Endpoint";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Button from "./Button";
import ProductValidator from "../Api/ProductValidator";
import { FaNairaSign } from "react-icons/fa6";

const Search = () => {
  const { searchTerm } = useParams();
  const [data, setData] = useState<
    {
      _id: string;
      name: string;
      description: string;
      price: number;
      image: string;
    }[]
  >([]);
  const [newTerm, setNewTerm] = useState("");
  const { handleEdit, deletePost, token, notAdmin } = ProductValidator();

  useEffect(() => {
    Search(searchTerm);
  }, [searchTerm]);
  const Search = async (item: string | undefined) => {
    try {
      const res = await axios.get(`${URL}/products/search?query=${item}`);
      const data = res.data;
      setData(data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <section className="mt-20 py-8">
      <div className="flex flex-col gap-16">
        <div className="flex qy:flex-row gap-9 flex-col items-start px-5">
          <div className="flex flex-row gap-9 sm:items-center">
            <p className="sm:text-2xl text-xl text-primary font-semibold font-poppins">
              Showing search results for:
            </p>
            <p className="text-xl font-semibold font-poppins text-black">
              {searchTerm || newTerm}
            </p>
          </div>
          <div className="relative qy:hidden flex w-full">
            <input
              type="search"
              defaultValue={searchTerm}
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="w-full py-3 px-3 rounded-lg text-black ring ring-primary focus:ring focus:outline-none focus:ring-red-200"
              placeholder="Search products..."
            />
            <div
              className="absolute right-0 h-full flex items-center px-4 bg-gray-300 rounded-lg cursor-pointer"
              onClick={() => Search(newTerm)}
            >
              <FaSearch className="text-black cursor-pointer" />
            </div>
          </div>
        </div>
        {/* Search Results */}

        {data.length !== 0 ? (
          <div className="grid qy:grid-cols-3 md:grid-cols-4 grid-cols-2 sm:w-[88%] w-full sm:px-0 px-2 m-auto items-center gap-2 xs:gap-5">
            {data.length > 0 &&
              data.map((item) => (
                <div
                key={item?._id}
                className="flex flex-col h-fit mr-8 p-image bg-shadow rounded-lg hover:scale-110 transition-all duration-500 bg-white gap-4 mb-6 pb-3"
              >
                <img
                  className="w-full h-fit object-cover aspect-square rounded-lg"
                  src={item?.image || "default-placeholder-image.jpg"}
                  alt={item?.name}
                />
                <div className="flex flex-col flex-wrap qy:gap-2.5 gap-1.5 px-4">
                  <h1 className="text-black mb-1 header h-10 qy:h-5 font-light qy:text-base text-sm font-poppins">
                    {item?.name}
                  </h1>
                  <h1 className="text-black header h-10 qy:h-6 text-wrap font-light qy:text-base text-sm font-poppins">
                    {item?.description}
                  </h1>
                  <p className="orange_gradient font-poppins font-semibold tracking-wide flex flex-row items-center">
                  <FaNairaSign className="text-black"/>{item?.price}
                  </p>
                  <Button
                    onSmash={() => console.log("pressed")}
                    styles="rounded-lg text-white hover:bg-green-500 text-center qy:text-base text-xs"
                    buttonText="Discuss product"
                    router="https://wa.me/08145534450"
                  />
                </div>
                {token === notAdmin && (
                  <div className="flex w-full px-4 justify-between h-fit sm:flex-row flex-col items-start sm:items-center gap-2">
                    <button
                      type="submit"
                      onClick={() => handleEdit(item._id)}
                      className="rounded-lg qy:text-base text-sm gap-4 py-2 px-3 bg-black-gradient bg-shadow text-white font-semibold tracking-widest"
                    >
                      Edit
                    </button>
                    <button
                      type="submit"
                      onClick={() => deletePost(item._id)}
                      className="rounded-lg py-2 qy:text-base text-sm px-3 bg-red-500 bg-shadow text-white font-semibold tracking-widest"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              ))}
          </div>
        ) : (
          <div className="bg-black-gradient text-white justify-center w-fit items-center rounded-lg py-5 flex m-auto  px-5">
            <p className="text-center">oops!! No items match your search</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
