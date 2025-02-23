import Login from "../Components/Login"
import { loginVideo } from "../assets"
const LoginPage = () => {
  return (
   
      <section>
        
        <div className="relative flex w-full">
          <video className="w-full min-h-screen bg-scroll bg-center bg-no-repeat bg-cover object-cover" src={loginVideo} autoPlay muted loop>
            </video>
            <h1 className='text-dimWhite text-center text-3xl font-bold italic absolute justify-center items-center flex w-full top-24'>Login to your account</h1>
                <Login />
        </div>
      </section>
  )
}

export default LoginPage