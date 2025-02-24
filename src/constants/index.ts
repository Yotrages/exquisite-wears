import { useNavigate } from "react-router-dom";

export const steps = [
  // Array of steps with sub-step descriptions
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


export const handleLogout = () => {
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.reload()
  };