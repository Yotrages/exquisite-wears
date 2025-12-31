import { FaArrowDown, FaSearch, FaShoppingCart, FaHeart, FaBell, FaBox, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Nigeria } from "../assets";
import { useState, useEffect } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import SearchValidator from "../Api/Search";
import { handleLogout } from "../constants";
import SearchInput from "./SearchInput";
import Sidebar from "./Sidebar";
import { useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';
import { getAuthToken } from '../utils/cookieManager';

const Nav = ({
  change,
  setChange,
}: {
  change: Boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    handleSearchToggle,
    setSearchTerm,
    searchTerm,
    searchToggle,
    handleSearch,
    data,
    userName,
    error,
    user,
    setToggle,
    setSearchToggle,
    toggle,
  } = SearchValidator();
  
  const navigate = useNavigate();
  const cartCount = useSelector((state: any) => state.cart?.items?.length || 0);
  
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Update parent's change state when searchToggle changes
  useEffect(() => {
    setChange(searchToggle);
  }, [searchToggle, setChange]);

  // Fetch wishlist count
  useEffect(() => {
    if (user) {
      fetchWishlistCount();
      fetchNotifications();
    }
  }, [user]);

  const fetchWishlistCount = async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/wishlist');
      setWishlistCount(res.data.items?.length || 0);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/notifications');
      const unread = res.data.notifications?.filter((n: any) => !n.read) || [];
      setNotificationCount(unread?.length);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const token = getAuthToken();
    if (!token) return;
    try {
      await apiClient.put(
        `/notifications/${notificationId}/read`,
        {}
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <>
      {/* Top Banner - Optional for promotions */}
      {/* <div className="bg-blue-600 text-white text-center py-2 text-sm">
        🎉 Free shipping on orders above ₦50,000! Limited time offer.
      </div> */}

      {/* Main Navbar */}
      <nav
        className={`w-full flex top-0 justify-between ${
          searchToggle && change
            ? "translate-x-[w-full] z-[1] overflow-hidden"
            : "fixed top-0 py-4 z-[10]"
        } items-center sm:px-8 xs:px-5 px-3 bg-white shadow-md text-black ${
          user ? "pt-5" : "pt-4"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <span className="flex items-center qy:text-[28px] text-[18px]">
            <h1 className="text-[#001F3F] font-bold tracking-widest">Exquisite</h1>
            <h1 className="text-[#001F3F] font-bold tracking-widest">Wears</h1>
          </span>
        </Link>

        {/* Search Form - Desktop */}
        <div className="inline-block relative flex-1 max-w-2xl mx-8">
          <div className="md:flex relative hidden">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none border-2 border-gray-300 rounded-lg text-black w-full"
              placeholder="Search for products, brands..."
              name="input"
            />
            <button
              className="absolute bg-blue-600 hover:bg-blue-700 h-full rounded-r-lg px-6 right-0 flex items-center transition-colors"
              onClick={() => handleSearch(searchTerm)}
            >
              <FaSearch className="text-white" />
            </button>
          </div>

          {/* Display Search Results */}
          {((data?.length || 0) > 0 || error) && (
            <ul className="absolute md:flex flex-col hidden max-h-[85vh] top-full left-0 w-full bg-white text-black z-[100] overflow-y-auto shadow-xl rounded-lg mt-2 border border-gray-200">
              {(data || [])?.map((item, index) => (
                <li
                  key={index}
                  className="py-3 px-4 flex flex-row cursor-pointer items-center hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  onClick={() => {
                    navigate(`/product/${item?._id}`);
                    setSearchTerm('');
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain mr-4 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">₦{item.price?.toLocaleString()}</div>
                  </div>
                </li>
              ))}
              {error && <li className="py-3 px-4 text-red-500">{error}</li>}
            </ul>
          )}
        </div>

        {/* Right Side Icons & Menu */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Currency Selector - Desktop only */}
            <div className="hidden xl:flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
              <img className="w-6 h-6" src={Nigeria} alt="NGN" />
              <span className="font-semibold">NGN</span>
              <FaArrowDown className="text-xs" />
            </div>

            {/* Mobile Search Icon */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={handleSearchToggle}
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative hover:text-red-500 transition-colors hidden sm:block"
              title="Wishlist"
            >
              <FaHeart className="text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                className="hover:text-blue-600 transition-colors hidden sm:block"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                <FaBell className="text-2xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 xs:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] max-h-96 overflow-y-auto max-w-[calc(100vw-1rem)]">
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  {notifications?.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    (notifications || [])?.slice(0, 5)?.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          markNotificationAsRead(notif._id);
                          setShowNotifications(false);
                          if (notif.link) navigate(notif.link);
                        }}
                      >
                        <div className="font-semibold text-sm text-gray-900">{notif.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{notif.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                  <Link
                    to="/notification"
                    className="block px-4 py-3 text-center text-blue-600 hover:bg-gray-50 font-semibold"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hover:text-blue-600 transition-colors"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                className="bg-blue-600 hover:bg-blue-700 transition-colors items-center w-9 h-9 rounded-full text-lg font-semibold justify-center flex text-white"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {userName}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900">Hello, {userName}!</div>
                    <div className="text-sm text-gray-600">Welcome back</div>
                  </div>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaBox className="text-lg" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 sm:hidden"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaHeart className="text-lg" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaCog className="text-lg" />
                    <span>Account Settings</span>
                  </Link>

                  <div className="border-t border-gray-200 mt-2"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout(navigate);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 w-full"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={handleSearchToggle}
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Auth Buttons */}
            <Link
              to="/register"
              className="px-4 py-2 ss:flex hidden hover:bg-blue-700 transition-colors rounded-lg bg-blue-600 text-white font-semibold"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="px-4 py-2 ss:flex hidden hover:bg-gray-100 transition-colors rounded-lg border-2 border-blue-600 text-blue-600 font-semibold"
            >
              Login
            </Link>

            {/* Mobile Menu Icon */}
            <button
              className="text-black ss:hidden flex hover:text-blue-600"
              onClick={() => setToggle((prev) => !prev)}
            >
              <CgMenuGridO className="text-3xl" />
            </button>

            {/* Cart for non-logged users */}
            <Link
              to="/cart"
              className="relative hidden ss:flex hover:text-blue-600 transition-colors"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </nav>

      {/* Sidebar for Mobile */}
      <Sidebar toggle={toggle} setToggle={setToggle} />

      {/* Mobile Search */}
      <SearchInput
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        searchToggle={searchToggle}
        setSearchTerm={setSearchTerm}
        data={data}
        error={error}
        setSearchToggle={setSearchToggle}
      />
    </>
  );
};

export default Nav;
