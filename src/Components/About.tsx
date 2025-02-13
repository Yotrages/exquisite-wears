import { about } from '../assets'
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section>
        <div className='flex sm:flex-row flex-col items-center justify-between px-5 gap-14'>
            <div><img src={about} alt="" /></div>
            <div className='flex flex-col gap-9 items-start justify-between'>
            <h1 className="xs:text-4xl text-3xl md:text-5xl font-bold text-black tracking-wide">
            We offer modern solutions for growing your business
            </h1>
            <h2 className="xs:text-2xl text-lg md:text-2xl tracking-wide text-black">
              TheExquisite, where creativity meets impeccable craftsmanship. We offered Custom-tailored fashion for your growing wardrobe, Redefining fashion, one stitch at a time.
            </h2>
            <Link to='/login' className='px-6 tracking-wider py-2 font-semibold hover:scale-110 transition duration-500 ease-in-out text-xl items-start justify-center rounded-lg bg-primary text-white '>Login</Link>
            </div>
        </div>
    </section>
  )
}

export default About;