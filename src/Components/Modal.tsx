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
         <div className={`flex flex-col z-10 transition-all duration-500 ease-in-out h-full gap-6 ${show ? 'w-full' : 'w-0'} py-5 px-5 items-center bg-black/90 fixed top-0`}>
         <div className="flex flex-col w-full items-end cursor-pointer justify-end">
         <IoMdClose className="text-[35px] text-white" onClick={() => setShow(false)}/>
         </div>
         <div className="flex w-full ss:w-[800px] h-full py-5 px-2 flex-col items-center">
        <img className="object-contain h-[500px] text-white ss:w-[50px] w-full" src={image} alt={name} />
         </div>
     </div>
    )}
    </>  
  )
}

export default Modal;