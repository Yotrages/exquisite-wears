import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'; 

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); 
  const [bg, setBg] = useState('border-primary')

  useEffect(() => {
    setIsLoading(true);
    setBg("border-green-500");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, [location]); 

  return (
    <div className={`flex bg-white fixed top-0 bottom-0 left-0 right-0 items-center justify-center min-h-screen ${
      isLoading ? "opacity-100 z-50" : "opacity-0 -z-10"
    }`}>
        <div className={`w-14 h-14 rounded-full border ${bg} border-l-white animate-spin`}></div>
    </div>
  );
};

export default Preloader;
