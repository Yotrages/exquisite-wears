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
        <button className={`${isVisible ? 'flex' : 'hidden'} items-center justify-center rounded-full fixed bottom-2 bg-[#001F3F] size-10 right-5`} onClick={goToTop}>
            <FaArrowUp className="text-white text-[25px]"/>
        </button>
    )
}

export default Backtotop