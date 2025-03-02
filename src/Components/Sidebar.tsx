import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'

interface sideBarProps {
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({toggle, setToggle} : sideBarProps) => {
  return (
    <div
            className={`text-black transition-all duration-500 rounded-l-lg ease-in fixed top-0 right-0 py-3 bg-white bg-shadow flex flex-col h-full gap-5 z-[10] overflow-x-hidden ${
              toggle ? "w-[200px] opacity-100" : "w-0 opacity-0"
            }`}
            onClick={() => setToggle((prev) => !prev)}
          >
            <div className="flex items-end justify-end px-3">
              <IoMdClose className="text-black size-10 hover:scale-105" />
            </div>
            <ul className="flex flex-col gap-3 px-3">
              <Link
                className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 "
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 "
                to="/about"
              >
                About
              </Link>
              <Link
                className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 "
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-lg font-semibold hover:text-gray-500 active:text-green-600 transition-all duration-150 hover:ml-2 "
                to="/register"
              >
                Register
              </Link>
            </ul>
          </div>
  )
}

export default Sidebar