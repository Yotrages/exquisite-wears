import { FaBell, FaFacebookMessenger, FaProductHunt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";

const Adminnav = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        window.localStorage.removeItem("userName");
        navigate("/login");
      };
      return (
    <nav className='flex justify-between px-5 py-5 items-center bg-[#f2f2f2] bg-shadow text-black'>
      <span className="flex items-center">
        <h1 className="text-[22px]  text-green-400 font-bold tracking-widest">Exqui</h1>
        <h1 className="text-[22px]  text-yellow-400 font-bold tracking-widest">site</h1>
      </span>

        <div className="flex gap-6 items-center">
            <Link className="flex hover:text-green-600 items-center gap-2" to='/Admin'>
                <FaFacebookMessenger  className="text-[18px]"/>
                <h3 className="text-[18px] font-semibold">Create post</h3>
            </Link>
            <span className="flex hover:text-green-600 gap-2 items-center cursor-pointer">
            <FaBell  className="text-[18px]"/>
            <h3 className="text-[18px] font-semibold">Notifications</h3>
            </span>
            <Link className="flex hover:text-green-600 items-center gap-2" to='/Admin'>
                <FaProductHunt  className="text-[18px]"/>
                <h3 className="text-[18px] font-semibold">Most Popular</h3>
            </Link>
            <Logout styles="" onsmash={handleLogout}/>
        </div>

    </nav>
  )
}

export default Adminnav;