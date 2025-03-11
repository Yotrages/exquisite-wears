import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { close } from '../assets';

interface searchProps {
    data: {name : string, image: string}[];
    error: string | null;
    setSearchToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    searchTerm: string;
    searchToggle: boolean;
    handleSearch: (term: string) => void
}
const SearchInput = ({searchToggle, searchTerm, setSearchTerm, setSearchToggle, error, handleSearch, data} : searchProps) => {
  return (
    <>
    {searchToggle && (
        <div className="fixed top-0 w-full py-4 px-5 bg-black z-[1] flex items-center gap-5 justify-between">
          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-3 rounded-lg text-black outline-none focus:ring focus:ring-red-200"
              placeholder="Search products..."
            />
            <div className="absolute right-0 top-0 h-full flex items-center px-4 bg-gray-200 rounded-lg" onClick={() => handleSearch(searchTerm)}>
              <FaSearch className="text-black" />
            </div>

            {/* Search Results */}
            {(data.length > 0 || error) && (
              <ul className="absolute top-full max-h-[85vh] left-0 w-full bg-white text-black overflow-y-scroll z-10 shadow-md rounded-lg px-3">
                {data.map((item, index) => (
                  <li
                    key={index}
                    className="py-2 flex items-center justify-between border-b cursor-pointer"
                    onClick={() => handleSearch(item.name)}
                  >
                    <img
                      src={item.image}
                      alt="product image"
                      className="w-10 h-10 flex object-cover rounded-md"
                    />
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
  )
}

export default SearchInput;