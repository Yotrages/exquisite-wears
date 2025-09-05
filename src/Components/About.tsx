import { about } from "../assets";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="pt-20 w-full pb-6">
      <div className="flex sm:flex-row flex-col w-full flex-wrap items-center justify-between px-5 gap-14">
        <div className="w-full flex-1">
          <img src={about} alt="" />
        </div>
        <div className="flex flex-1 flex-col gap-9 items-start justify-between">
          <h1 className="xs:text-4xl text-3xl md:text-5xl font-bold text-black tracking-wide">
            Elevate Your Style with Expert Tailoring
          </h1>
          <h2 className="xs:text-2xl text-lg md:text-2xl tracking-wide text-black">
            At Exquisite wears, we blend artistry with precision to create
            custom-tailored pieces that fit perfectly. From timeless designs to
            modern trends, we craft fashion that speaks to your unique style.
          </h2>
          <Link
            to="/register"
            className="px-6 tracking-wider py-3 font-semibold hover:scale-110 transition duration-500 ease-in-out text-xl items-start justify-center rounded-lg bg-primary text-white "
          >
            Get started with us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
