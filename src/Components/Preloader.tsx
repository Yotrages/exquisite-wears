import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'; // Detects route changes

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // Tracks URL changes
  const [bg, setBg] = useState('border-primary')

  useEffect(() => {
    // When location (page) changes, show preloader
    setIsLoading(true);
    setBg("border-green-500");

    // Hide preloader after a short delay (simulating content loading)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust delay as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [location]); // Runs every time the URL changes

  return (
    <div className={`flex bg-white fixed top-0 bottom-0 left-0 right-0 items-center justify-center min-h-screen ${
      isLoading ? "opacity-100 z-50" : "opacity-0 -z-10"
    }`}>
        <div className={`w-14 h-14 rounded-full border ${bg} border-l-white animate-spin`}></div>
    </div>
  );
};

export default Preloader;
