import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Whatsapp = () => {
  return (
    <section className="px-4">
        <div className='m-auto sm:w-[700px] w-full px-4 bg-black-gradient rounded-lg items-center text-center mt-8 py-5'>
            <span className='text-white flex w-fit m-auto gap-5 flex-col'>
            <h1 className='font-semibold font-poppins tracking-wider leading-6 '>Feel free to connect with us on whatsapp.</h1>
            <Link to='https://wa.me/08145534450' className="flex items-center justify-center gap-4 py-3 rounded-lg font-semibold font-poppins  text-black bg-blue-gradient text-center">
            <FaWhatsapp className="text-[22px]"/>
            <p className="tracking-wider leading-6">Connect with Exquisite</p>
            </Link>
            </span>
        </div>
    </section>
  )
}

export default Whatsapp;