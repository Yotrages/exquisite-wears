import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { FaBox, FaEye, FaSpinner, FaChevronRight, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { format } from 'date-fns';
import Layout from '../Components/Layout';
import { HiOutlineShoppingBag } from 'react-icons/hi';

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  pending:    { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: <FaClock className="text-amber-500" />,       label: 'Pending' },
  processing: { color: 'text-orange-700',   bg: 'bg-orange-50',   border: 'border-orange-200',   icon: <FaSpinner className="text-orange-500 animate-spin" />, label: 'Processing' },
  shipped:    { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: <MdLocalShipping className="text-orange-500" />, label: 'Shipped' },
  delivered:  { color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: <FaCheckCircle className="text-green-500" />,  label: 'Delivered' },
  cancelled:  { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    icon: <FaTimesCircle className="text-red-500" />,    label: 'Cancelled' },
};

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.authSlice);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { orders, loading, error, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchUserOrders();
  }, [token, navigate]);

  if (!token) return null;

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order: any) => order.status === filterStatus);

  const filterTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const orderCounts = filterTabs.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter((o: any) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <FaChevronRight className="text-[10px]" />
              <span className="text-gray-900 font-medium">My Orders</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <FaBox className="text-orange-500 text-lg" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>My Orders</h1>
                <p className="text-sm text-gray-500">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
            {filterTabs.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                <span className="capitalize">{status === 'all' ? 'All Orders' : status}</span>
                {orderCounts[status] > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    filterStatus === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {orderCounts[status]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48" />
                      <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded-xl w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <FaBox className="text-4xl text-orange-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {orders.length === 0 ? 'No Orders Yet' : 'No orders match this filter'}
              </h2>
              <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping!"
                  : 'Try selecting a different filter.'}
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                  <HiOutlineShoppingBag className="text-lg" /> Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => {
                const cfg = statusConfig[order.status] || statusConfig['pending'];
                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order</span>
                        <span className="text-sm font-bold text-gray-900">#{order._id?.slice(-8).toUpperCase()}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          {/* Product Previews */}
                          <div className="flex items-center gap-2 mb-3">
                            {order.items?.slice(0, 4).map((item: any, idx: number) => (
                              item.product?.image ? (
                                <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                              ) : null
                            ))}
                            {order.items?.length > 4 && (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white shadow-sm">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>

                          {/* Summary */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Items</p>
                              <p className="font-semibold text-gray-900">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Total</p>
                              <p className="font-black text-gray-900 text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                ₦{order.prices?.totalPrice?.toLocaleString()}
                              </p>
                            </div>
                            {order.shippingAddress?.city && (
                              <div>
                                <p className="text-gray-400 text-xs mb-0.5">Deliver to</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                  <FaTruck className="text-gray-400 text-xs" />
                                  {order.shippingAddress.city}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap self-start sm:self-center"
                        >
                          <FaEye className="text-xs" />
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
