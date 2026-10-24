import React from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface searchProps {
    data: {name : string, image: string; _id: string; price: number}[];
    error: string | null;
    setSearchToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    searchTerm: string;
    searchToggle: boolean;
    handleSearch: (term: string) => void
}
const SearchInput = ({searchToggle, searchTerm, setSearchTerm, setSearchToggle, error, handleSearch, data} : searchProps) => {
  const navigate = useNavigate();
  return (
    <>
    {searchToggle && (
        <div className="fixed top-0 w-full py-4 px-5 bg-white z-50 shadow-lg flex items-center gap-3 justify-between">
          {/* Search Bar */}
          <div className="relative w-full flex-1">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="w-full py-3 px-4 pr-12 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Search products..."
              autoFocus
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              onClick={() => handleSearch(searchTerm)}
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Search Results */}
            {(data?.length > 0 || error) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                    <FaSearch className="text-gray-300" />
                    {error}
                  </div>
                )}
                {(data || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                    onClick={() => { navigate(`/product/${item._id}`); setSearchTerm(''); setSearchToggle(false); }}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-500 flex-shrink-0">₦{item.price?.toLocaleString()}</span>
                  </div>
                ))}
                {(data?.length || 0) > 0 && (
                  <button
                    className="w-full py-3 text-center text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors border-t border-gray-50"
                    onClick={() => { handleSearch(searchTerm); setSearchTerm(''); setSearchToggle(false); }}
                  >
                    See all results for "{searchTerm}" →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-2 flex-shrink-0"
            onClick={() => {
              setSearchToggle(false);
              setSearchTerm("");
            }}
            aria-label="Close search"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
      )}

    </>
  )
}

export default SearchInput;