import React from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleLogout } from "../constants";
import {
  FaHome, FaHeart, FaShoppingCart, FaBell, FaBox,
  FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus,
  FaBolt, FaFire, FaTshirt, FaMobileAlt, FaLaptop,
  FaHeartbeat, FaBook, FaBaby, FaInfoCircle, FaEnvelope
} from "react-icons/fa";

interface sideBarProps {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ toggle, setToggle }: sideBarProps) => {
  const navigate = useNavigate();
  const authState = useSelector((state: any) => state.authSlice);
  const user = authState?.user;
  const cartCount = useSelector((state: any) => state.cart?.items?.length || 0);

  const close = () => setToggle(false);

  const navLink = (to: string, icon: React.ReactNode, label: string, badge?: number) => (
    <Link
      to={to}
      onClick={close}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors text-gray-700 hover:text-orange-600 font-medium text-sm"
    >
      <span className="text-orange-400 w-5">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Overlay */}
      {toggle && (
        <div
          className="fixed inset-0 bg-black/40 z-[998] transition-opacity"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-[999] flex flex-col shadow-2xl transition-all duration-300 ${
          toggle ? "w-72 opacity-100" : "w-0 opacity-0"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-orange-500">
          <div>
            <p className="text-white font-black text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Exquisite</p>
            {user ? (
              <p className="text-orange-100 text-xs">Hello, {user.name?.split(' ')[0]}!</p>
            ) : (
              <p className="text-orange-100 text-xs">Welcome!</p>
            )}
          </div>
          <button onClick={close} className="text-white hover:bg-orange-600 rounded-lg p-1.5 transition-colors">
            <IoMdClose className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2">
          {/* Main links */}
          <div className="mb-3">
            {navLink('/', <FaHome />, 'Home')}
            {navLink('/flash-sales', <FaBolt className="text-red-500" />, 'Flash Sales')}
            {navLink('/trending', <FaFire className="text-orange-500" />, 'Trending')}
            {navLink('/cart', <FaShoppingCart />, 'Cart', cartCount)}
            {navLink('/wishlist', <FaHeart />, 'Wishlist')}
          </div>

          {/* Categories */}
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Categories</p>
            {navLink('/category/Fashion', <FaTshirt />, 'Fashion')}
            {navLink('/category/Electronics', <FaLaptop />, 'Electronics')}
            {navLink('/category/Phones', <FaMobileAlt />, 'Phones')}
            {navLink('/category/Health', <FaHeartbeat />, 'Health')}
            {navLink('/category/Books', <FaBook />, 'Books')}
            {navLink('/category/Baby', <FaBaby />, 'Baby')}
          </div>

          {/* Account */}
          {user ? (
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Account</p>
              {navLink('/orders', <FaBox />, 'My Orders')}
              {navLink('/notification', <FaBell />, 'Notifications')}
              {navLink('/settings', <FaCog />, 'Settings')}
            </div>
          ) : null}

          {/* Info */}
          <div className="mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-2">Info</p>
            {navLink('/about', <FaInfoCircle />, 'About Us')}
            {navLink('/contact', <FaEnvelope />, 'Contact Us')}
          </div>
        </div>

        {/* Footer auth actions */}
        <div className="px-3 py-3 border-t border-gray-100">
          {user ? (
            <button
              onClick={() => { close(); handleLogout(navigate); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
            >
              <FaSignOutAlt className="w-5" />
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={close} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-bold text-sm hover:bg-orange-50 transition-colors">
                <FaSignInAlt /> Log In
              </Link>
              <Link to="/register" onClick={close} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors">
                <FaUserPlus /> Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
