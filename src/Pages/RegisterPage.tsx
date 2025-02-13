import Register from '../Components/Register'
import { loginVideo } from '../assets';

const RegisterPage = () => {
  return (
    <div className="relative flex w-full">
    <video className="w-full min-h-screen bg-scroll bg-center bg-no-repeat bg-cover object-cover" src={loginVideo} autoPlay muted loop>
      </video>
      <h1 className='orange_gradient text-center text-3xl font-bold italic absolute justify-center items-center flex w-full top-24'>Register an account</h1>
        <Register />
  </div>
  )
}

export default RegisterPage;