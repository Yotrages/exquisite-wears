import Contact from "../Components/Contact";
import Feeds from "../Components/Feeds";
import Hero from "../Components/Hero";
import Layout from "../Components/Layout";
import WatchSlider from "../Components/Slider";
// import Preloader from "../Components/Preloader";
import Whatsapp from "../Components/Whatsapp";


const Home = () => {
  return (
    <Layout>
      {/* <Preloader /> */}
      <Hero />
      <WatchSlider />
      <Feeds />
      <Contact />
      <Whatsapp />
    </Layout>
  )
}

export default Home;