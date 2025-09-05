import { IoMdClose } from "react-icons/io"

interface ModalProps {
    image: string | undefined
    show: boolean
    name: string | undefined
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({show, image, setShow, name} : ModalProps) => {
  if (!show) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/70 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${show ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div 
        className={`
          relative w-full max-w-2xl mx-auto
          bg-gradient-to-br from-white via-gray-50 to-amber-50
          rounded-2xl shadow-2xl border border-amber-100
          transform transition-all duration-300 ease-out
          ${show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          overflow-hidden
        `}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-amber-100/50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {name || 'Product Preview'}
            </h2>
          </div>
          
          <button
            onClick={() => setShow(false)}
            className="
              group relative p-2 rounded-full
              bg-gray-100 hover:bg-red-50
              transition-all duration-200 ease-in-out
              hover:scale-110 active:scale-95
            "
            aria-label="Close modal"
          >
            <IoMdClose className="text-2xl text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-active:scale-100 transition-transform duration-200"></div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Container */}
          <div className="relative group">
            {/* Decorative border */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            
            {/* Main Image */}
            <div className="relative bg-white rounded-xl p-4 shadow-lg border border-amber-100">
              <img 
                className="
                  w-full h-auto max-h-96 object-contain 
                  rounded-lg transition-transform duration-500 
                  group-hover:scale-105
                " 
                src={image} 
                alt={name || 'Product image'}
                loading="lazy"
              />
              
              {/* Overlay gradient for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-lg pointer-events-none"></div>
            </div>
            
            {/* Premium badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⌚ Premium
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-6 space-y-4">
            {/* Product Name */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {name || 'Luxury Timepiece'}
              </h3>
             
            </div>

            {/* Features */}
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-amber-100/50">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <span className="text-sm">Tap outside or press</span>
            <kbd className="px-2 py-1 text-xs font-semibold bg-white rounded border border-amber-200">ESC</kbd>
            <span className="text-sm">to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;