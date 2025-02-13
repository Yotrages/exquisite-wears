import { Routes, Route } from "react-router-dom"
import { Home, Cart, Checkout, Product, Admin, LoginPage, RegisterPage, Admindashboard, Edit, NotificationPage, AboutPage } from "./Pages"

const App = () => {
  return (
   <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/Cart" element={<Cart />}/>
    <Route path="/Checkout" element={<Checkout />}/>
    <Route path="/Product" element={<Product />}/>
    <Route path="/Admin" element={<Admin />}/>
    <Route path="/Login" element={<LoginPage />}/>
    <Route path="/Register" element={<RegisterPage />}/>
    <Route path="/Dashboard" element={<Admindashboard/>}/>
    <Route path="/Edit/:id" element={<Edit />}/>
    <Route path="/Notification" element={<NotificationPage />}/>
    <Route path="/About" element={<AboutPage />}/>
   </Routes>
  )
}

export default App