import { Routes, Route } from "react-router-dom"
import { Home, Cart, Checkout, Product, Admin, LoginPage, RegisterPage, Admindashboard, Edit, NotificationPage, AboutPage, ForgotPassword, SearchPage } from './App/index'
import OAuthSuccess from "./App/Oauth-success"

const App = () => {
  return (
   <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/Cart" element={<Cart />}/>
    <Route path="/Checkout" element={<Checkout />}/>
    <Route path="/Product" element={<Product />}/>
    <Route path="/admin" element={<Admin />}/>
    <Route path="/login" element={<LoginPage />}/>
    <Route path="/register" element={<RegisterPage />}/>
    <Route path="/Dashboard" element={<Admindashboard/>}/>
    <Route path="/edit/:id" element={<Edit />}/>
    <Route path="/notification" element={<NotificationPage />}/>
    <Route path="/about" element={<AboutPage />}/>
    <Route path="/forgotpassword" element={<ForgotPassword />}/>
    <Route path="/search/:searchTerm" element={<SearchPage />}/>
    <Route path="/oauth-success" element={<OAuthSuccess />}/>
   </Routes>
  )
}

export default App