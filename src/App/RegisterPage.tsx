import Register from '../Components/Register'
import { loginVideo } from '../assets';

const RegisterPage = () => {
  return (
    <div className="relative flex w-full">
  {/* Video Background */}
  <video 
    className="absolute top-0 left-0 w-full h-full object-cover"
    src={loginVideo} 
    autoPlay 
    muted 
    loop 
  />

  {/* Content Wrapper */}
  <div className="relative z-10 flex flex-col items-center mt-7 justify-center w-full min-h-screen p-4 text-center">
    <h1 className="text-dimWhite text-2xl md:text-3xl mb-10 font-bold italic">
      Register an account
    </h1>
    <Register />
  </div>
</div>

  )
}

export default RegisterPage;