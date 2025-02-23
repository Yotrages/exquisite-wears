import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import Question from "./Question";
import { MessageCenter } from "./Message";
import RegisterValidator from "../Api/RegisterValidator";

const Register = () => {
  
  const { handleSubmit, error, errors, submission, success, loading, password, register, setPassword} = RegisterValidator()

  return (
    <div className="w-full absolute justify-center items-center flex top-1/4">
       <MessageCenter success={success} error={error}/>
      <div className="fixed items-center justify-center top-20">
      </div>
      <form
        className="xs:w-[500px] w-full px-5"
        onSubmit={handleSubmit(submission)}
      >
        <div className="flex flex-col gap-8 px-2">
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label
              htmlFor="email"
              id="email"
              className="text-[18px] font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              {...register("email", { required: true })}
              className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              placeholder="Enter your Email"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label
              htmlFor="name"
              id="name"
              className="text-[18px] font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              required
              {...register("name", { required: true })}
              className="px-3 py-3 w-full text-black rounded-lg focus:outline-none"
              placeholder="Enter your Username"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 items-start text-white text-base font-semibold">
            <label
              htmlFor="password"
              id="email"
              className="text-[18px] font-semibold"
            >
              Password
            </label>
            <div className="flex flex-col relative w-full">
              <input
                type={password ? "text" : "password"}
                id="password"
                {...register("password", { required: true })}
                required
                placeholder="Enter your password"
                className="px-3 py-3 w-full focus:outline-none text-black rounded-lg"
              />
              <span
                className="absolute right-4 top-4 text-[22px] text-black"
                onClick={() => setPassword((prev) => !prev)}
              >
                {password ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-lg gap-4 py-3 px-7 bg-black-gradient bg-shadow text-white font-semibold text-[18px] tracking-widest"
          >
            {loading ? (
              <p className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" />
                Register
              </p>
            ) : (
              <p>Register</p>
            )}
          </button>
          <Question type="register"/>
        </div>
      </form>
    </div>
  );
};

export default Register;
