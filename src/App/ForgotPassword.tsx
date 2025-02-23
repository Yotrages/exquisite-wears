import { loginVideo } from "../assets"
import ChangePassword from "../Components/ChangePassword"

const ForgotPassword = () => {
  return (
    <section>
        
    <div className="relative flex w-full">
      <video className="w-full min-h-screen bg-scroll bg-center bg-no-repeat bg-cover object-cover" src={loginVideo} autoPlay muted loop>
        </video>
        <h1 className='text-dimWhite text-center text-3xl font-bold italic absolute justify-center items-center flex w-full top-24'>Change your Password</h1>
            <ChangePassword />
    </div>
  </section>
  )
}

export default ForgotPassword