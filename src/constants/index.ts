import { NavigateFunction } from "react-router-dom";
import { appDispatch } from "../redux/store";
import { logout } from "../redux/authSlice";

export const steps = [
  [
    { label: "Enter your name", placeholder: "Name", type: 'text' },
    { label: "Enter your email", placeholder: "Email", type: 'email' },
    { label: "Upload a file", placeholder: "File", type: 'file' },
  ],
  [
    { label: "Set your password", placeholder: "Password", type: 'password' },
    { label: "Confirm your password", placeholder: "Confirm Password", type: 'password'},
    { label: "Choose a security question", placeholder: "Security Question", type: 'text' },
  ],
  [
    { label: "Enter your address", placeholder: "Address", type: 'text' },
    { label: "Enter your city", placeholder: "City", type: 'text'},
    { label: "Enter your postal code", placeholder: "Postal Code", type: 'number' },
  ],
];

export const handleLogout = (navigate: NavigateFunction, dispatch: appDispatch) => {
    // Dispatch Redux logout action to clear auth state
    dispatch(logout());

    // Clear localStorage
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");

    // Navigate to login page for protected routes, otherwise reload
    if (window.location.pathname === "/admin" ||
      window.location.pathname.startsWith("/edit") ||
      window.location.pathname === "/notification" ||
      window.location.pathname === "/settings" ||
      window.location.pathname === "/orders" ||
      window.location.pathname.startsWith("/order/") ||
      window.location.pathname === "/wishlist" ||
      window.location.pathname === "/cart" ||
      window.location.pathname === "/checkout") {
      navigate('/login')
    } else {
      window.location.reload()
    }
  };