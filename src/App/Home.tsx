import Feeds from "../Components/Feeds";
import Hero from "../Components/Hero";
import Layout from "../Components/Layout";
import WatchSlider from "../Components/Slider";
import RecommendedForYou from "../Components/RecommendedForYou";
import TrendingProducts from "../Components/TrendingProducts";
import Categories from "../Components/Categories";
import RecentlyViewed from "../Components/RecentlyViewed";
import FlashSales from "../Components/FlashSales";


const Home = () => {
  return (
    <Layout>
      {/* <Preloader /> */}
      <Hero />
      <FlashSales />
      <Categories />
      <WatchSlider />
      <TrendingProducts />
      <Feeds />
      <RecentlyViewed />
      <RecommendedForYou />
    </Layout>
  )
}

export default Home;