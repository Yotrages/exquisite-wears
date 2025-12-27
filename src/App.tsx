import { Routes, Route, useLocation } from "react-router-dom"
import { Suspense, useEffect } from "react"
import { Home, Cart, Checkout, Product, Admin, LoginPage, RegisterPage, AdminDashboard, Edit, NotificationPage, AboutPage, ForgotPassword, SearchPage, Orders, OrderTracking, OrderSuccess, OAuthSuccess } from './App/lazyComponents'
import Settings from "./App/Settings"
import NotificationPreferences from "./App/NotificationPreferences"
import ContactPage from "./App/ContactPage"
import { RouteLoader, preloadCriticalRoutes, preloadSecondaryRoutes, preloadAdminRoutes, preloadOrderRoutes } from './App/lazyComponents'
import WishlistPage from "./App/WishlistPage"
import ComparePage from './App/ComparePage'

const App = () => {
  const location = useLocation()

  // Preload critical routes on app load
  useEffect(() => {
    preloadCriticalRoutes()
  }, [])

  // Preload secondary routes when navigating to product/cart area
  useEffect(() => {
    if (location.pathname === '/product' || location.pathname === '/cart' || location.pathname === '/checkout') {
      preloadSecondaryRoutes()
    }
  }, [location.pathname])

  // Preload admin routes when navigating to admin area
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/dashboard') {
      preloadAdminRoutes()
    }
  }, [location.pathname])

  // Preload order routes when navigating to orders area
  useEffect(() => {
    if (location.pathname.startsWith('/order') || location.pathname === '/orders') {
      preloadOrderRoutes()
    }
  }, [location.pathname])

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/checkout" element={<Checkout />}/>
        <Route path="/product/:id" element={<Product />}/>
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/dashboard" element={<AdminDashboard/>}/>
        <Route path="/edit/:id" element={<Edit />}/>
        <Route path="/notification" element={<NotificationPage />}/>
        <Route path="/about" element={<AboutPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/search/:searchTerm" element={<SearchPage />}/>
        <Route path="/oauth-success" element={<OAuthSuccess />}/>
        <Route path="/orders" element={<Orders />}/>
        <Route path="/order/:orderId" element={<OrderTracking />}/>
        <Route path="/order-success" element={<OrderSuccess />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/notification-preferences" element={<NotificationPreferences />}/>
      </Routes>
    </Suspense>
  )
}

export default App