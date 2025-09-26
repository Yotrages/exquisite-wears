import { NavigateFunction } from "react-router-dom";

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

export const handleLogout = (navigate: NavigateFunction) => {
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    if ( window.location.pathname === "/admin" ||
      window.location.pathname.startsWith("/edit") ||
      window.location.pathname === "/notification") {
      navigate('/login')
    } else {
      window.location.reload()
    }
  };