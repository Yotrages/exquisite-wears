import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"

const Backtotop = () => {
    const [isVisible, setIsvisible] = useState(false)
    
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
      }

  useEffect(() => {
    const handler = () => {
        if (window.scrollY > 300) {
            setIsvisible(true)
        } else {
            setIsvisible(false)
        }
    }
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)

  }, [])
    
    return (
        <button className={`${isVisible ? 'flex' : 'hidden'} items-center justify-center rounded-full fixed bottom-20 md:bottom-4 right-4 xs:right-5 bg-[#001F3F] w-10 h-10 text-white hover:scale-110 transition-transform`} onClick={goToTop}>
            <FaArrowUp className="text-lg"/>
        </button>
    )
}

export default Backtotop