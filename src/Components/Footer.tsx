import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaPhone, FaMapMarkerAlt, FaEnvelope, FaChevronRight, FaSpinner } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import subscribeValidator from "../Api/SubscribeValidator";
import { MessageRight } from "./Message";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { date, error, errors, register, handleSubmit, subscribe, success, loading } = subscribeValidator();
  const navigate = useNavigate();

  const links = {
    shop: ['Fashion', 'Electronics', 'Phones', 'Home & Living', 'Sports', 'Beauty'],
    help: ['Track Order', 'Return Policy', 'Shipping Info', 'FAQ', 'Contact Us'],
    account: ['My Account', 'Orders', 'Wishlist', 'Cart', 'Settings'],
  };

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <MessageRight error={error} success={success} />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Exquisite<span className="text-orange-500">Wears</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Premium timepieces and luxury accessories for those who appreciate the finer things in life.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-2.5">
              <a href="tel:08145534450" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <FaPhone className="text-orange-500 text-xs flex-shrink-0" />
                08145534450
              </a>
              <a href="mailto:info@exquisitewears.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <FaEnvelope className="text-orange-500 text-xs flex-shrink-0" />
                info@exquisitewears.com
              </a>
              <span className="flex items-center gap-2.5 text-sm text-gray-400">
                <FaMapMarkerAlt className="text-orange-500 text-xs flex-shrink-0" />
                Ibadan, Oyo State, Nigeria
              </span>
            </div>

            {/* Social media */}
            <div className="flex items-center gap-3">
              <Link
                to="https://www.instagram.com/the_exquisite_wears?igsh=MWRheHhvMmhvMzh4Mw=="
                title="Instagram"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaInstagram className="text-sm" />
              </Link>
              <Link
                to="https://www.tiktok.com/@the.exquisite.wears?_t=ZM-8tuPLsoPUoQ&_r=1"
                title="TikTok"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaTiktok className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Shop</h3>
            <ul className="space-y-2">
              {links.shop.map(item => (
                <li key={item}>
                  <button
                    onClick={() => navigate(`/search/${item}`)}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <FaChevronRight className="text-[10px] text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {links.help.map(item => (
                <li key={item}>
                  <Link
                    to={item === 'Contact Us' ? '/contact' : item === 'Track Order' ? '/orders' : '/about'}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <FaChevronRight className="text-[10px] text-gray-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get exclusive deals, new arrivals, and style inspiration straight to your inbox.
            </p>
            <form onSubmit={handleSubmit(subscribe)} className="space-y-3">
              <div>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : null}
                Subscribe
              </button>
            </form>

            {/* Payment methods */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">We Accept</p>
              <div className="flex items-center flex-wrap gap-3">
                <div className="bg-white rounded px-2 py-1">
                  <SiVisa className="text-blue-700 text-2xl" />
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <SiMastercard className="text-red-500 text-2xl" />
                </div>
                <div className="bg-gray-700 rounded px-3 py-1.5 text-xs font-bold text-green-400">Paystack</div>
                <div className="bg-gray-700 rounded px-3 py-1.5 text-xs font-bold text-blue-400">Flutterwave</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {date} Exquisite Wears. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-xs text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="text-xs text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-gray-600">
            Designed by <span className="text-gradient font-bold">Awesome Tech</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
