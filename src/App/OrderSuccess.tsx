import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaBox, FaEnvelope } from 'react-icons/fa';
import Layout from '../Components/Layout';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) navigate('/');
  }, [orderId, navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-5">
            {/* Animated Check */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
              <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your order has been placed and is being prepared with care.
            </p>

            {/* Order ID */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">Order ID</p>
              <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                #{orderId?.slice(-12).toUpperCase()}
              </p>
            </div>

            {/* Email Notice */}
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-left mb-6">
              <FaEnvelope className="text-orange-500 text-lg flex-shrink-0" />
              <p className="text-sm text-orange-700">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/order/${orderId}`)}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm"
              >
                <FaBox className="text-sm" />
                Track Order
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm"
              >
                <FaHome className="text-sm" />
                Back Home
              </button>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>What Happens Next?</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'We carefully prepare and package your order' },
                { step: '2', text: 'You receive a shipping confirmation with tracking number' },
                { step: '3', text: 'Track your package in real-time from your orders page' },
                { step: '4', text: 'Receive your order and enjoy your purchase!' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
