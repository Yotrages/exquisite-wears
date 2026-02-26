import { FaSpinner, FaEnvelope, FaUser, FaTag, FaCommentDots, FaCheckCircle } from "react-icons/fa";
import { contact } from "../assets";
import ContactValidator from "../Api/ContactValidator";
import { useState } from "react";

const Contact = () => {
  const { handleSubmit, errors, register, submission, loading } = ContactValidator();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    await submission(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5">
          <FaCheckCircle className="text-4xl text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Message Sent!</h2>
        <p className="text-gray-500 max-w-sm">We've received your message and will get back to you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-sm text-gray-800 transition-colors placeholder:text-gray-400 bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center">
      {/* Left: illustration + info */}
      <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start gap-6">
        <img src={contact} className="w-full max-w-xs mx-auto lg:mx-0" alt="Contact Illustration" />

        <div className="space-y-4 w-full">
          {[
            { icon: '📧', title: 'Email Us', sub: 'support@exquisite.ng' },
            { icon: '📞', title: 'Call Us', sub: '+234 (0) 800 EXQUISITE' },
            { icon: '💬', title: 'Live Chat', sub: 'Available Mon–Fri, 9am–6pm' },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-7/12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Send us a message
            </h2>
            <p className="text-sm text-gray-500">Fill in the form below and we'll respond promptly.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="email">
                <span className="flex items-center gap-2"><FaEnvelope className="text-orange-500" /> Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                required
                {...register("email", { required: true })}
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Name */}
            <div>
              <label className={labelClass} htmlFor="name">
                <span className="flex items-center gap-2"><FaUser className="text-orange-500" /> Full Name</span>
              </label>
              <input
                type="text"
                id="name"
                required
                {...register("name", { required: true })}
                className={inputClass}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className={labelClass} htmlFor="subject">
                <span className="flex items-center gap-2"><FaTag className="text-orange-500" /> Subject</span>
              </label>
              <input
                type="text"
                id="subject"
                required
                {...register("subject", { required: true })}
                className={inputClass}
                placeholder="What is your message about?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className={labelClass} htmlFor="message">
                <span className="flex items-center gap-2"><FaCommentDots className="text-orange-500" /> Message</span>
              </label>
              <textarea
                id="message"
                required
                {...register("message", { required: true })}
                placeholder="Tell us how we can help you..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 mt-2"
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> Sending...</>
              ) : (
                <>Send Message <span className="text-lg">→</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
