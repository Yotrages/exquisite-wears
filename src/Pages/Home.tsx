import Contact from "../Components/Contact";
import Feeds from "../Components/Feeds";
import Hero from "../Components/Hero";
import Layout from "../Components/Layout";
// import Preloader from "../Components/Preloader";
import Whatsapp from "../Components/Whatsapp";


const Home = () => {
  return (
    <Layout>
      {/* <Preloader /> */}
      <Hero />
      <Feeds />
      <Contact />
      <Whatsapp />
    </Layout>
  )
}

export default Home;