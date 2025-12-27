import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { FaBox, FaTruck, FaHome, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId?: string }>();
  const { token } = useSelector((state: any) => state.authSlice);
  
  const [activeTab, setActiveTab] = useState<'tracking' | 'details' | 'items'>('tracking');
  
  const { orders, currentOrder, loading, error, fetchOrderById, fetchUserOrders, cancelOrder } =
    useOrderStore();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (paramOrderId) {
      fetchOrderById(paramOrderId);
    } else {
      fetchUserOrders();
    }
  }, [token, paramOrderId, navigate]);

  const order = paramOrderId ? currentOrder : orders[0];

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order && !paramOrderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping now!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: FaBox },
    { status: 'processing', label: 'Processing', icon: FaSpinner },
    { status: 'shipped', label: 'Shipped', icon: FaTruck },
    { status: 'delivered', label: 'Delivered', icon: FaHome },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.status === order.status);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order._id?.slice(-8)}</h1>
              <p className="text-gray-600">
                Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full font-semibold text-white text-sm ${
                  order.status === 'delivered'
                    ? 'bg-green-600'
                    : order.status === 'shipped'
                      ? 'bg-blue-600'
                      : order.status === 'processing'
                        ? 'bg-yellow-600'
                        : 'bg-gray-600'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Progress</h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                  >
                    <Icon className="text-lg" />
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
              <p className="text-lg font-semibold text-gray-900">{order.trackingNumber}</p>
              <p className="text-sm text-gray-600 mt-2">
                Use this number to track your package with the courier
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex">
            {(['tracking', 'details', 'items'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-4 font-semibold text-center transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'tracking' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
                <div className="space-y-4">
                  {order.status === 'pending' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-900">
                        Your order is being prepared for shipment. You'll receive a tracking number once it's shipped.
                      </p>
                    </div>
                  )}
                  {order.status === 'processing' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        Your order is being processed and will be shipped soon.
                      </p>
                    </div>
                  )}
                  {order.status === 'shipped' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        Your order is on its way! Expected delivery: {order.deliveryDate ? format(new Date(order.deliveryDate), 'MMM dd, yyyy') : 'Soon'}
                      </p>
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900">
                        Your order was delivered on {order.deliveredAt ? format(new Date(order.deliveredAt), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  )}
                  {order.status === 'cancelled' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-900">
                        Your order was cancelled. {order.notes && `Reason: ${order.notes}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.fullName}
                      <br />
                      {order.shippingAddress?.address}
                      <br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                      <br />
                      {order.shippingAddress?.country}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.email}
                      <br />
                      {order.shippingAddress?.phone}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                  </div>

                  {/* Order Dates */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dates</h4>
                    <p className="text-sm text-gray-600">
                      Placed: {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      <br />
                      {order.deliveredAt &&
                        `Delivered: ${format(new Date(order.deliveredAt), 'MMM dd, yyyy')}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item._id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          ₦{(item.product?.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">₦{order.prices?.itemsPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-medium">₦{order.prices?.shippingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900 font-medium">₦{order.prices?.taxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{order.prices?.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Order Button */}
        {order.status === 'pending' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this order?')) {
                  cancelOrder(order._id, 'Customer requested cancellation');
                  navigate('/orders');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
