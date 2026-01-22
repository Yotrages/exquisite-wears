import Feeds from "../Components/Feeds";
import Hero from "../Components/Hero";
import Layout from "../Components/Layout";
import WatchSlider from "../Components/Slider";
import RecommendedForYou from "../Components/RecommendedForYou";
import TrendingProducts from "../Components/TrendingProducts";
import Categories from "../Components/Categories";
import RecentlyViewed from "../Components/RecentlyViewed";
import FlashSales from "../Components/FlashSales";
import PageLoader from "../Components/PageLoader";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector((state: any) => state.authSlice);

  useEffect(() => {
    // Wait for auth to be restored before rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader message="Preparing your experience..." />;
  }

  return (
    <Layout>
      {/* <Preloader /> */}
      <Hero />
      <FlashSales />
      {/* <Categories /> */}
      <WatchSlider />
      <TrendingProducts />
      <Feeds />
      <RecentlyViewed />
      {authState?.isAuthenticated && <RecommendedForYou />}
    </Layout>
  );
};

export default Home;