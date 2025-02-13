import { Link } from "react-router-dom";
import { FaInstagram, FaPhoneAlt, FaSpinner, FaWhatsapp } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import { payments } from "../assets";
import { SubSchema } from "../Schema/SubscribeSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { URL } from "../Api/AdminApi";

type SubscribeForm = z.infer<typeof SubSchema>
const Footer = () => {
  const [success, setSuccess] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {formState: {errors}, handleSubmit, register, reset} = useForm<SubscribeForm>({resolver: zodResolver(SubSchema)})
  const subscribe = (email: SubscribeForm) => {
    const subscription = async () => {
      setLoading(true)
      const formData = new FormData()
      formData.append('email', email.email)
      try {
        const res = await axios.post(`${URL}/subscribe`, formData)
        console.log(res.data)

        if (res.status === 201) {
          setLoading(false)
          setSuccess('Subscription Successful')
          reset()
         setTimeout(() => setSuccess(""), 3000)
        }

      } catch (error : any) {
        console.error(error)
        if (error.response) {
          setError(error.response.data.message)
        } else if (error.request) {
          setError('Server not responding, check your connection')
        } else {
          setError('Something went wrong')
        }
      }
      setLoading(false)
      setTimeout(() => setError(""), 3000);
      clearTimeout(3000)
    }
    subscription()
  }
  const date = new Date().getFullYear()
  return (
    <section className="mt-14 w-full py-4 bg-black">
        {error && (
          <div className="bg-red-600 rounded-lg text-white right-4 fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 rounded-lg text-white right-4 fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {success}
          </div>
        )}
      <div className="bg-black text-white sm:flex-row-reverse flex-col w-[85%] gap-9 py-4 mx-auto flex justify-between">
        <div className="flex items-start flex-col gap-5">
          <h3 className="text-[18px] font-semibold font-poppins text-white">
            SIGN UP FOR DISCOUNTS & UPDATES
          </h3>
          <form id="subscribe" onSubmit={handleSubmit(subscribe)}>
            <input
              type="email"
              id="subscribe"
              {...register("email", {required: true})}
              className="text-[#7e7e7e] bg-[#ffffff30] w-full px-4 mb-5 py-3 rounded-xl"
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-400">{errors.email.message}</p>}
            
            <button
              type="submit"
              className="rounded-lg  gap-4 py-3 px-7 bg-blue-gradient bg-shadow text-black font-semibold text-[18px] tracking-widest"
            >
              {loading ? (
                <p className="flex items-center justify-center gap-3">
                  <FaSpinner className="animate-spin" />
                Subscribe
                </p>
              ) : (
                <p>Subscribe</p>
              )}
            </button>
          </form>
          <Link className="underline text-[20px]" to="/about">
            About Us
          </Link>
        </div>

        <div className="flex items-start flex-col gap-6">
          <h3 className="text-[18px] font-semibold font-poppins text-white">
            CONTACT US
          </h3>
          <span className="flex items-center gap-3">
            <FaPhoneAlt />
            <a href="tel:+2349029282035">08145534450</a>
          </span>
          <span className="flex items-center gap-4">
            <FaLocationPin />
            <address>Ibadan, Oyo. Nigeria.</address>
          </span>
          <img src={payments} loading="lazy" alt="" />
          <span className="flex items-center gap-4">
            <Link className="text-[30px]" to="https://wa.me/08145534450">
              <FaWhatsapp />
            </Link>
            <Link className="text-[30px]" to="https://HarDeyBare28">
              <FaInstagram />
            </Link>
          </span>
        </div>
      </div>
      <hr className="w-[90%] mx-auto bg-white mt-4"/>
      <div className="flex justify-between items-center text-white w-[90%] px-4 gap-4 mx-auto mt-4">
        <p className="leading-6 text-[18px] font-semibold">&copy; {date}. All Rights Reserved</p>
        <h1>Designed by <i className="text-gradient font-bold">Awesome Tech</i></h1>
      </div>
    </section>
  );
};

export default Footer;
