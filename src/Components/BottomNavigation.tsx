import { FaHome, FaSearch, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function BottomNavigation() {
  const location = useLocation()
  const cartCount = useSelector((state: any) => state.cart?.items?.length || 0)
  const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/cart', icon: FaShoppingCart, label: 'Cart', badge: cartCount },
    { path: '/wishlist', icon: FaHeart, label: 'Wishlist', badge: wishlistCount },
    { path: '/settings', icon: FaUser, label: 'Account' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all ${
                active
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              {/* Icon */}
              <Icon
                className={`transition-all ${
                  active ? 'text-2xl mb-1' : 'text-xl mb-1'
                }`}
              />

              {/* Label */}
              <span
                className={`text-xs font-medium transition-all ${
                  active ? 'font-bold' : ''
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
