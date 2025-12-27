import React, { lazy, Suspense } from 'react';
import { FaSpinner } from 'react-icons/fa';

// Preload function
const preloadComponent = (importFunc: any) => {
  importFunc();
};

// Loading component
export const RouteLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center">
      <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
);

// Lazy load all pages
export const Home = lazy(() => import('../App/Home'));
export const Cart = lazy(() => import('../App/Cart'));
export const Checkout = lazy(() => import('../App/Checkout'));
export const Product = lazy(() => import('../App/Product'));
export const Admin = lazy(() => import('../App/AdminPage'));
export const LoginPage = lazy(() => import('../App/LoginPage'));
export const RegisterPage = lazy(() => import('../App/RegisterPage'));
export const AdminDashboard = lazy(() => import('../App/Admindashboard'));
export const Edit = lazy(() => import('../App/Edit'));
export const NotificationPage = lazy(() => import('../App/NotificationPage'));
export const AboutPage = lazy(() => import('../App/AboutPage'));
export const ForgotPassword = lazy(() => import('../App/ForgotPassword'));
export const SearchPage = lazy(() => import('../App/SearchPage'));
export const Orders = lazy(() => import('../App/Orders'));
export const OrderTracking = lazy(() => import('../App/OrderTracking'));
export const OrderSuccess = lazy(() => import('../App/OrderSuccess'));
export const OAuthSuccess = lazy(() => import('../App/Oauth-success'));
export const Settings = lazy(() => import('../App/Settings'));
export const NotificationPreferences = lazy(() => import('../App/NotificationPreferences'));
export const WishlistPage = lazy(() => import('./WishlistPage'));
export const ContactPage = lazy(() => import('./ContactPage'));

// Wrapper for lazy components
export const LazyRoute = ({ Component }: { Component: React.ComponentType<any> }) => (
  <Suspense fallback={<RouteLoader />}>
    <Component />
  </Suspense>
);

// Preload functions for critical routes
export const preloadCriticalRoutes = () => {
  preloadComponent(() => import('../App/Home'));
  preloadComponent(() => import('../App/LoginPage'));
  preloadComponent(() => import('../App/RegisterPage'));
};

// Preload secondary routes
export const preloadSecondaryRoutes = () => {
  preloadComponent(() => import('../App/Product'));
  preloadComponent(() => import('../App/Cart'));
  preloadComponent(() => import('../App/Checkout'));
  preloadComponent(() => import('../App/WishlistPage'));
};

// Preload admin routes
export const preloadAdminRoutes = () => {
  preloadComponent(() => import('../App/Admindashboard'));
  preloadComponent(() => import('../App/AdminPage'));
};

// Preload order routes
export const preloadOrderRoutes = () => {
  preloadComponent(() => import('../App/Orders'));
  preloadComponent(() => import('../App/OrderTracking'));
  preloadComponent(() => import('../App/OrderSuccess'));
  preloadComponent(() => import('../App/ContactPage'));
};

export default {
  Home,
  Cart,
  Checkout,
  Product,
  Admin,
  LoginPage,
  RegisterPage,
  AdminDashboard,
  Edit,
  NotificationPage,
  AboutPage,
  ForgotPassword,
  SearchPage,
  Orders,
  OrderTracking,
  OrderSuccess,
  OAuthSuccess,
  Settings,
  NotificationPreferences,
  LazyRoute,
};

