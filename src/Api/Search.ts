import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "./Endpoint";
import { useNavigate } from "react-router-dom";

const SearchValidator = () => {
    const [searchToggle, setSearchToggle] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");
      const [data, setData] = useState<{ name: string; image: string }[]>([]);
      const [error, setError] = useState<string | null>(null);
      const [toggle, setToggle] = useState(false);
      const navigate = useNavigate()
    
      
    
      useEffect(() => {
        const fetchSearchResults = async () => {
          if (searchTerm.trim() === "") {
            setData([]);
            setError(null);
            return;
          }
    
          try {
            const response = await axios.get(`${URL}/products/search?query=${searchTerm}`);
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
    
      const handleSearch = (term: string) => {
        navigate(`/search/${term}`)
      }
      useEffect(() => {
        window.addEventListener("scroll", () => {
          setSearchToggle(false);
        });
      });
    
      const user = localStorage.getItem("userName");
      const userName = user?.charAt(0).toUpperCase();

      return { handleSearchToggle, searchTerm, searchToggle, handleSearch, toggle, setToggle, data, userName, error, setSearchTerm, user, setSearchToggle}
    
}

export default SearchValidator