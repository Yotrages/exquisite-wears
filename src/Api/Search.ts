import apiClient from "./axiosConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchResponse } from "./ApiResponses";
import { rootState } from "../redux/store";

const SearchValidator = () => {
    const [searchToggle, setSearchToggle] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<{ name: string; image: string; _id: string, price: number }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate();
    const authState = useSelector((state: rootState) => state.authSlice);
    const user = authState?.user?.name || null;
    const userName = user?.charAt(0).toUpperCase();
    
    useEffect(() => {
      const fetchSearchResults = async () => {
        if (searchTerm.trim() === "") {
          setData([]);
          setError(null);
          return;
        }
  
        try {
          const response = await apiClient.get<SearchResponse[]>(`/products/search?query=${searchTerm}`);
          setData(response.data);
          setError(null);
        } catch (err: any) {
          setData([]);
          const errorMsg = err.response?.data?.message || "No items match your search." || err.response?.data?.error || "An error occurred.";
          setError(errorMsg);
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

    return { handleSearchToggle, searchTerm, searchToggle, handleSearch, toggle, setToggle, data, userName, error, setSearchTerm, user, setSearchToggle}
    
}

export default SearchValidator