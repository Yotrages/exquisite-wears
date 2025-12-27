import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaBox } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Redirect if no order ID
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-mono font-semibold text-gray-900 break-all">
            {orderId?.slice(-12)}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            A confirmation email has been sent to your registered email address. You can track your order status anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/order/${orderId}`)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            <FaBox />
            Track Your Order
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
          >
            <FaHome />
            Back to Home
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What Happens Next?</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1</span>
              <span>We'll process and prepare your order for shipment</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2</span>
              <span>You'll receive a shipping confirmation with tracking number</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3</span>
              <span>Track your package in real-time on your order page</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">4</span>
              <span>Receive your order and enjoy your purchase!</span>
            </li>
          </ol>
        </div>

        {/* Contact Support */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <a
            href="mailto:support@exquisitewears.com"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
