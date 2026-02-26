import Feeds from "../Components/Feeds";
import Hero from "../Components/Hero";
import Layout from "../Components/Layout";
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
      <Hero />
      <Categories />
      <FlashSales />
      <TrendingProducts />
      <RecentlyViewed />
      {(authState?.isAuthenticated || authState?.token || authState?.user) && <RecommendedForYou />}
      <Feeds />
    </Layout>
  );
};

export default Home;
