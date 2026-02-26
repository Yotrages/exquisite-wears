import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { FaBox, FaTruck, FaSpinner, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaChevronRight } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { format } from 'date-fns';
import Layout from '../Components/Layout';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId?: string }>();
  const { token } = useSelector((state: any) => state.authSlice);
  const [activeTab, setActiveTab] = useState<'tracking' | 'details' | 'items'>('tracking');
  const { orders, currentOrder, loading, error, fetchOrderById, fetchUserOrders, cancelOrder } = useOrderStore();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (paramOrderId) fetchOrderById(paramOrderId);
    else fetchUserOrders();
  }, [token, paramOrderId, navigate]);

  const order = paramOrderId ? currentOrder : orders[0];
  if (!token) return null;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <FaBox className="text-5xl text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {!order ? (paramOrderId ? 'Order Not Found' : 'No Orders Yet') : 'Something went wrong'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">{error || (paramOrderId ? "This order doesn't exist." : "You haven't placed any orders yet.")}</p>
            <button onClick={() => navigate(paramOrderId ? '/orders' : '/')} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95">
              {paramOrderId ? 'View All Orders' : 'Start Shopping'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusSteps = [
    { status: 'pending',    label: 'Order Placed', icon: FaClock },
    { status: 'processing', label: 'Processing',   icon: FaSpinner },
    { status: 'shipped',    label: 'Shipped',       icon: MdLocalShipping },
    { status: 'delivered',  label: 'Delivered',     icon: FaCheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'cancelled';

  const statusBadge: Record<string, string> = {
    pending:    'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-orange-50 text-orange-700 border-orange-200',
    shipped:    'bg-orange-50 text-orange-700 border-orange-200',
    delivered:  'bg-green-50 text-green-700 border-green-200',
    cancelled:  'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <Link to="/orders" className="hover:text-orange-500 transition-colors">My Orders</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-gray-900 font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Back */}
          <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 mb-5 transition-colors font-semibold">
            <FaArrowLeft className="text-xs" /> Back to Orders
          </button>

          {/* Order Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge[order.status] || statusBadge['pending']}`}>
                    {isCancelled ? <FaTimesCircle /> : currentStepIndex === statusSteps.length - 1 ? <FaCheckCircle /> : <FaClock />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
              </div>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                ₦{order.prices?.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5">
              <h2 className="text-base font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Delivery Progress</h2>
              <div className="relative">
                {/* Line */}
                <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-100 z-0">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%` }}
                  />
                </div>
                <div className="relative z-10 grid grid-cols-4 gap-2">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const done = index <= currentStepIndex;
                    const current = index === currentStepIndex;
                    return (
                      <div key={step.status} className="flex flex-col items-center text-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${done ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'} ${current ? 'ring-4 ring-orange-200 scale-110' : ''}`}>
                          <Icon className="text-sm" />
                        </div>
                        <p className={`text-[11px] sm:text-xs font-semibold leading-tight ${done ? 'text-orange-600' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-gray-900">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {(['tracking', 'details', 'items'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? 'text-orange-500 border-orange-500 bg-orange-50/50'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {/* Tracking tab */}
              {activeTab === 'tracking' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-sm">Delivery Timeline</h3>
                  {isCancelled ? (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                      This order was cancelled. {order.notes && `Reason: ${order.notes}`}
                    </div>
                  ) : order.status === 'delivered' ? (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 font-medium flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      Delivered on {order.deliveredAt ? format(new Date(order.deliveredAt), 'MMMM dd, yyyy') : 'N/A'}
                    </div>
                  ) : order.status === 'shipped' ? (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700">
                      <div className="flex items-center gap-2 font-semibold mb-1"><MdLocalShipping /> Your order is on its way!</div>
                      <p>Expected delivery: {order.deliveryDate ? format(new Date(order.deliveryDate), 'MMMM dd, yyyy') : '3–7 business days'}</p>
                    </div>
                  ) : order.status === 'processing' ? (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                      Your order is being prepared and will be shipped soon.
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600">
                      Order received! We're getting it ready for shipment.
                    </div>
                  )}
                </div>
              )}

              {/* Details tab */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">Shipping Address</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-0.5">
                      <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">Contact & Payment</h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-0.5">
                      <p>{order.shippingAddress?.email}</p>
                      <p>{order.shippingAddress?.phone}</p>
                      <p className="mt-2 font-semibold">Payment: {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items tab */}
              {activeTab === 'items' && (
                <div>
                  <div className="space-y-3 mb-5">
                    {order.items?.map((item: any) => (
                      <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {(item.product?.images?.[0] || item.product?.image) && (
                          <img src={item.product.images?.[0] || item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{item.product?.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-black text-gray-900 text-sm">₦{(item.product?.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    {[
                      { label: 'Subtotal', value: order.prices?.itemsPrice },
                      { label: 'Shipping', value: order.prices?.shippingPrice },
                      { label: 'Tax', value: order.prices?.taxPrice },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm text-gray-600">
                        <span>{label}</span>
                        <span>₦{(value || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-base pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-orange-500">₦{order.prices?.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cancel */}
          {order.status === 'pending' && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this order?')) {
                    cancelOrder(order._id, 'Customer requested cancellation');
                    navigate('/orders');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                <FaTimesCircle /> Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
