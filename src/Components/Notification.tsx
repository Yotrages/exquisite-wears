import { FaSpinner } from "react-icons/fa";
import ConnectToBe from "../Api/NotificationValidator";
import Button from "./Button";

const Notification = () => {
  const { errors, Notify, handleSubmit, register, loading, navigate, show, setShow } = ConnectToBe()
  return (
    <section className="pb-10 pt-7 md:pt-10 mt-20 w-full">
      <div
          className={`bg-primary text-white fixed top-28 left-1/2 -translate-x-1/2 h-fit rounded-lg justify-center items-center z-10 transition-all duration-500 ease-in-out flex flex-col ${
            show ? "w-[180px] xs:w-[200px] opacity-100" : "w-0 opacity-0"
          } py-2 px-3`}
        >
          <p className="text-lg font-poppins font-semibold text-center">do you want to notify about another product</p>
          <span className="flex flex-row gap-5 items-center justify-between">
            <Button
              onSmash={() => setShow(false)}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router=""
              buttonText="yes"
            />
            <Button
              onSmash={() => navigate("/")}
              styles="hover:bg-green-400 bg-shadow rounded-full"
              router="/"
              buttonText="no"
            />
          </span>
        </div>
      <h1 className="sm:text-5xl text-2xl font-poppins text-primary tracking-wider font-extrabold text-center mb-9">
        Notify all users
      </h1>
      <form
        onSubmit={handleSubmit(Notify)}
        className="flex items-center gap-8 flex-col w-full px-3 xs:px-5 sm:w-3/6 md:w-2/5 xl:w-2/5 m-auto"
      >
        <div className="flex flex-col w-full items-start gap-5">
          <label className="text-xl font-bold" htmlFor="subject" id="subject">
            Subject
          </label>
          <input
            type="text"
            {...register("subject")}
            id="subject"
            className="w-full py-2 focus:outline-none px-3 rounded-lg flex border ring-primary ring hover:border-yellow-400"
          />
          {errors.subject && (
            <p className="text-red-700">{errors.subject.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full items-start gap-5">
          <label className="text-xl font-bold" htmlFor="message" id="message">
            Message
          </label>
          <textarea
            {...register("message")}
            id="subject"
            className="w-full px-3 focus:outline-none py-3 rounded-lg flex border ring ring-primary hover:border-yellow-400"
          />
          {errors.message && (
            <p className="text-red-500">{errors.message.message}</p>
          )}
        </div>
        <button
          className="bg-white rounded-full transition-all duration-500 hover:scale-110 bg-shadow orange_gradient px-4 py-3 text-center items-center justify-center flex gap-4"
          type="submit"
        >
          {loading ? (
            <span className="flex flex-row items-center gap-3 justify-center">
              <FaSpinner className="text-lg text-black animate-spin" />
              Send Message
            </span>
          ) : (
            <span>Send Message</span>
          )}
        </button>
      </form>
    </section>
  );
};

export default Notification;
