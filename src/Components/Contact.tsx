import { FaSpinner} from "react-icons/fa";
import { contact } from "../assets";
import ContactValidator from "../Api/ContactValidator";

const Contact = () => {
  
  const { handleSubmit, errors, register, submission, loading } = ContactValidator()

  return (
    <div className="w-full justify-between items-center px-3 xs:px-5 sm:px-8 xl:px-28 gap-5 sm:gap-10 md:gap-20 flex-col sm:flex-row flex py-10">
     <div className="w-full sm:w-1/2"><img src={contact} className="w-full max-w-sm mx-auto" alt="Contact" /></div>
      <form
        className="w-full sm:w-1/2 px-2 xs:px-3 sm:px-0"
        onSubmit={handleSubmit(submission)}
      >
        <div className="flex flex-col gap-8 px-2">
          <div className="flex flex-col gap-4 items-start text-black text-base font-semibold">
            <label
              htmlFor="email"
              id="email"
              className="text-base sm:text-lg font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              {...register("email", { required: true })}
              className="px-3 py-3 w-full text-black rounded-lg border-[2px] border-green-300 focus:outline-yellow-300"
              placeholder="Enter your Email"
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 items-start text-black text-base font-semibold">
            <label
              htmlFor="name"
              id="name"
              className="text-base sm:text-lg font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              required
              {...register("name", { required: true })}
              className="px-3 py-3 w-full text-black rounded-lg border-[2px] border-green-300 focus:outline-yellow-300"
              placeholder="Enter your Username"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 items-start text-black text-base font-semibold">
            <label
              htmlFor="subject"
              id="subject"
              className="text-base sm:text-lg font-semibold"
            >
              Subject
            </label>
              <input
                type='text'
                id="Subject"
                {...register("subject", { required: true })}
                required
                placeholder="Enter the subject of your message"
                className="px-3 py-3 w-full text-black rounded-lg border-[2px] border-green-300 focus:outline-yellow-300"
              />
            {errors.subject && (
              <p className="text-red-600">{errors.subject.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 items-start text-black text-base font-semibold">
            <label
              htmlFor="message"
              id="message"
              className="text-base sm:text-lg font-semibold"
            >
              Message
            </label>
              <textarea
            id="Subject"
                {...register("message", { required: true })}
                required
                placeholder="Enter your message"
                className="px-3 py-3 w-full border-[2px] border-green-300 focus:outline-yellow-300 text-black rounded-lg"
              />
            {errors.message && (
              <p className="text-red-600">{errors.message.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-lg gap-4 py-2 px-4 sm:py-3 sm:px-7 bg-black-gradient bg-shadow text-white font-semibold text-sm sm:text-base tracking-widest"
          >
            {loading ? (
              <p className="flex items-center justify-center gap-3">
                <FaSpinner className="animate-spin" />
                Send message
              </p>
            ) : (
              <p>Send message</p>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
