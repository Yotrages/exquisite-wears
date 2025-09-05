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
          <div className={`flex z-50 transition-all w-full max-w-lg duration-500 ease-in-out h-full gap-3 py-5 px-5 justify-center items-center fixed inset-0`}>
         <div className="flex flex-col w-full items-end cursor-pointer justify-end">
         <IoMdClose className="text-[35px] text-white" onClick={() => setShow(false)}/>
         </div>
         <div className="flex w-full py-5 px-2 flex-col items-center">
        <img className="object-contain text-white" src={image} alt={name} />
         </div>
     </div>
        )}
    </>  
  )
}

export default Modal;