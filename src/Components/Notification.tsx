import { FaSpinner, FaBell, FaUsers, FaEnvelope } from "react-icons/fa";
import ConnectToBe from "../Api/NotificationValidator";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Notification = () => {
  const { errors, Notify, handleSubmit, register, loading, navigate, show, setShow } = ConnectToBe();
  const { user } = useSelector((state: any) => state.authSlice);

  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      {/* Success overlay */}
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-3xl text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Notification Sent!</h3>
            <p className="text-gray-500 text-sm mb-6">All subscribers have been notified successfully.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShow(false)}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Send Another
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-2xl text-orange-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Notify All Subscribers
          </h1>
          <p className="text-gray-500 text-sm mt-2">Send an email notification to all newsletter subscribers</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(Notify)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5" htmlFor="subject">
              Email Subject
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                {...register("subject")}
                id="subject"
                placeholder="e.g. New arrivals just dropped 🔥"
                className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5" htmlFor="message">
              Message Body
            </label>
            <textarea
              {...register("message")}
              id="message"
              rows={6}
              placeholder="Write your notification message here..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-orange-200 text-sm"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Sending to all subscribers...
              </>
            ) : (
              <>
                <FaBell />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Notification;
