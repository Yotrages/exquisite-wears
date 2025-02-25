import { Link } from "react-router-dom"

const Question = ({type} : {type: string}) => {
  return (
    <div className="flex flex-col items-start">
        {
          type === 'login' ? (
            <div className="flex flex-wrap gap-2 items-center item-center text-lg">
              <p className="text-white">Don't have an account?</p>
              <Link to='/register' className="text-dimWhite">Register</Link>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap item-center text-lg">
              <p className="text-white">Already have an account?</p>
              <Link to='/login' className="text-dimWhite">Login</Link>
            </div>
          )
        }
    </div>
  )
}

export default Question;