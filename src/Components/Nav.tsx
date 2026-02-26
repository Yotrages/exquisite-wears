import {
  FaSearch, FaShoppingCart, FaHeart, FaBell, FaBox,
  FaCog, FaSignOutAlt, FaChevronDown, FaUser, FaTruck,
  FaHeadset, FaTag
} from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdLocalOffer } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
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
  const cartTotal = useSelector((state: any) =>
    state.cart?.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0
  );

  const [wishlistCount, setWishlistCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChange(searchToggle);
  }, [searchToggle, setChange]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlistCount();
      fetchNotifications();
    }
  }, [user]);

  const fetchWishlistCount = async () => {
    try {
      const res = await apiClient.get('/wishlist');
      setWishlistCount(res.data.items?.length || 0);
    } catch { }
  };

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      const unread = res.data.notifications?.filter((n: any) => !n.read) || [];
      setNotificationCount(unread.length);
      setNotifications(res.data.notifications?.slice(0, 6) || []);
    } catch { }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`, {});
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const quickLinks = [
    { label: 'Flash Sales', icon: MdLocalOffer, to: '/search/fashion', color: 'text-red-500' },
    { label: 'Track Order', icon: FaTruck, to: '/orders', color: 'text-blue-500' },
    { label: 'Help', icon: FaHeadset, to: '/contact', color: 'text-green-500' },
    { label: 'Deals', icon: FaTag, to: '/search/electronics', color: 'text-orange-500' },
  ];

  return (
    <>
      {/* === TOP PROMO BAR === */}
      <div className="fixed w-full top-0 bg-gray-900 text-gray-200 text-xs py-1.5 hidden sm:block z-[51]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {quickLinks.map(({ label, icon: Icon, to, color }) => (
              <Link key={label} to={to} className={`flex items-center gap-1.5 hover:text-white transition-colors ${color}`}>
                <Icon className="text-xs" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>📦 Free delivery on orders above ₦50,000</span>
          </div>
        </div>
      </div>

      {/* === MAIN NAV === */}
      <nav className={`w-full fixed top-0 sm:top-7 z-50 bg-white transition-all duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-3 py-3">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 group-hover:text-orange-500 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Exquisite
                </span>
                <span className="text-[10px] tracking-widest text-orange-500 font-semibold uppercase">Wears</span>
              </div>
            </Link>

            {/* Search bar - desktop */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block relative">
              <div className="flex items-stretch rounded-lg overflow-hidden border-2 border-orange-400 focus-within:border-orange-500 transition-colors">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                  className="flex-1 py-2.5 px-4 text-sm text-gray-800 outline-none bg-white placeholder-gray-400"
                  placeholder="Search products, brands and categories..."
                />
                <button
                  className="bg-orange-500 hover:bg-orange-600 transition-colors px-5 flex items-center justify-center"
                  onClick={() => handleSearch(searchTerm)}
                >
                  <FaSearch className="text-white text-sm" />
                </button>
              </div>

              {/* Search dropdown */}
              {((data?.length || 0) > 0 || error) && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[200] max-h-[70vh] overflow-y-auto mt-0.5">
                  {error && (
                    <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                      <FaSearch className="text-gray-300" />
                      {error}
                    </div>
                  )}
                  {(data || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => { navigate(`/product/${item?._id}`); setSearchTerm(''); }}
                    >
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                        {/* <p className="text-xs text-gray-500 mt-0.5">{item.category || 'Product'}</p> */}
                      </div>
                      <span className="text-sm font-bold text-orange-500 flex-shrink-0">₦{item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                  {(data?.length || 0) > 0 && (
                    <button
                      className="w-full py-3 text-center text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
                      onClick={() => { navigate(`/search/${searchTerm}`); setSearchTerm(''); }}
                    >
                      See all results for "{searchTerm}" →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">

              {/* Mobile search */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={handleSearchToggle}>
                <FaSearch className="text-gray-700 text-lg" />
              </button>

              {user ? (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:flex items-center justify-center" title="Wishlist">
                    <FaHeart className="text-gray-600 text-lg" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications */}
                  <div className="relative hidden sm:block" ref={notifRef}>
                    <button
                      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
                    >
                      <FaBell className="text-gray-600 text-lg" />
                      {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                          <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                          {notificationCount > 0 && (
                            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">{notificationCount} new</span>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center">
                            <FaBell className="text-3xl text-gray-200 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-orange-50 transition-colors ${!notif.read ? 'bg-orange-50/50' : ''}`}
                              onClick={() => { markNotificationAsRead(notif._id); setShowNotifications(false); if (notif.link) navigate(notif.link); }}
                            >
                              {!notif.read && <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 mb-0.5" />}
                              <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                        <Link to="/notification" className="block py-3 text-center text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors" onClick={() => setShowNotifications(false)}>
                          View all notifications →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <Link to="/cart" className="relative flex items-center gap-2 p-2 sm:px-3 rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="relative">
                      <FaShoppingCart className="text-gray-700 group-hover:text-orange-500 text-lg transition-colors" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </div>
                    {cartCount > 0 && (
                      <div className="hidden sm:block">
                        <p className="text-xs text-gray-500 leading-none">Cart</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">₦{cartTotal.toLocaleString()}</p>
                      </div>
                    )}
                  </Link>

                  {/* Mobile menu */}
                  <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setToggle(v => !v)}>
                    <HiMenuAlt3 className="text-2xl text-gray-700" />
                  </button>

                  {/* User avatar menu */}
                  <div className="relative hidden sm:block" ref={userMenuRef}>
                    <button
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {userName}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-xs text-gray-500 leading-none">Hello,</p>
                        <p className="text-sm font-semibold text-gray-900 leading-tight flex items-center gap-1">
                          Account <FaChevronDown className="text-xs" />
                        </p>
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 z-[200] overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 bg-orange-500">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 font-bold text-lg">{userName}</div>
                            <div>
                              <p className="font-bold text-white">Hello, {userName}!</p>
                              <p className="text-xs text-orange-100">Welcome back</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          {[
                            { to: '/orders', icon: FaBox, label: 'My Orders' },
                            { to: '/wishlist', icon: FaHeart, label: 'Wishlist', badge: wishlistCount },
                            { to: '/notification', icon: FaBell, label: 'Notifications', badge: notificationCount },
                            { to: '/settings', icon: FaCog, label: 'Account Settings' },
                          ].map(({ to, icon: Icon, label, badge }) => (
                            <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 text-sm" onClick={() => setShowUserMenu(false)}>
                              <Icon className="text-gray-400 w-4" />
                              <span className="flex-1">{label}</span>
                              {badge && badge > 0 && (
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
                              )}
                            </Link>
                          ))}
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              onClick={() => { setShowUserMenu(false); handleLogout(navigate); }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-500 w-full text-sm"
                            >
                              <FaSignOutAlt className="w-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaShoppingCart className="text-gray-700 text-lg" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
                    )}
                  </Link>

                  <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setToggle(v => !v)}>
                    <HiMenuAlt3 className="text-2xl text-gray-700" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    <Link to="/login" className="px-4 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition-colors">
                      Log in
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* === CATEGORY NAV BAR (desktop) === */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 py-2 text-sm overflow-x-auto scrollbar-hide">
              {[
                'Fashion', 'Electronics', 'Phones & Tablets', 'Home & Living',
                'Sports', 'Beauty', 'Baby Products', 'Books', 'Computing'
              ].map(cat => (
                <Link
                  key={cat}
                  to={`/search/${cat}`}
                  className="whitespace-nowrap text-gray-600 hover:text-orange-500 font-medium transition-colors py-1 border-b-2 border-transparent hover:border-orange-500"
                >
                  {cat}
                </Link>
              ))}
              <Link to="/search/all" className="whitespace-nowrap text-orange-500 hover:text-orange-600 font-semibold ml-auto flex items-center gap-1">
                All Categories <FaChevronDown className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[58px] sm:h-[135px]" />

      <Sidebar toggle={toggle} setToggle={setToggle} />
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
