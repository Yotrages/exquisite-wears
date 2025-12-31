import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../stores/orderStore';
import { FaBox, FaEye, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.authSlice);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { orders, loading, error, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserOrders();
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((order: any) => order.status === filterStatus);

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']?.map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status?.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        {filteredOrders?.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {orders?.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {orders?.length === 0
                ? "You haven't placed any orders yet. Start shopping now!"
                : 'No orders match the selected filter.'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders?.map((order: any) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id?.slice(-8)}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[order.status] || statusColors['pending']
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Order Date</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Items</p>
                        <p className="font-medium text-gray-900">{order.items?.length || 0} item(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Total</p>
                        <p className="font-bold text-blue-600 text-lg">
                          ₦{order.prices?.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items?.slice(0, 3)?.map((item: any) => (
                          <span
                            key={item._id}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            {item.product?.name?.substring(0, 20)}... x{item.quantity}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                            +{order.items?.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                        <p className="font-mono text-sm font-medium text-gray-900">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition whitespace-nowrap"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
