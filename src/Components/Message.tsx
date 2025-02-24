
interface MessageProps {
  error: string | null;
  success: string;
}

 export const MessageCenter = ({error, success} : MessageProps) => {
  return (
    <div>
      {error && (
          <div className="bg-red-600 rounded-lg text-white fixed top-5 z-10 items-center justify-center text-center px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 rounded-lg text-white fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {success}
          </div>
        )}
    </div>
  )
}


 export const MessageRight = ({error, success} : MessageProps) => {
  return (
    <div>
      {error && (
          <div className="bg-red-600 rounded-lg text-white right-4 fixed top-5 z-10 justify-center items-center text-center px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 rounded-lg text-white right-4 fixed top-7 z-10 justify-center items-center text-center px-4 py-3">
            {success}
          </div>
        )}
    </div>
  )
}

