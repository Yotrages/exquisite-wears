import { IoMdClose } from "react-icons/io"

interface ModalProps {
    image: string | undefined
    show: boolean
    name: string | undefined
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({show, image, setShow, name} : ModalProps) => {
  return (
    <>
    {show && (
         <div className={`flex flex-col z-10 transition-all duration-500 ease-in-out h-screen gap-6 ${show ? 'w-full' : 'w-0'} py-5 px-5 items-center bg-black/20 fixed top-0`}>
         <div className="flex flex-col w-full items-end justify-end">
         <IoMdClose className="text-[25px] text-white" onClick={() => setShow(false)}/>
         </div>
         <div className="flex w-full h-full qy:w-[500px] px-2 flex-col items-center justify-center">
        <img src={image} alt={name} />
         </div>
     </div>
    )}
    </>  
  )
}

export default Modal;