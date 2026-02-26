import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../stores/adminStore';
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaExclamationTriangle,
  FaSpinner,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state: any) => state.authSlice);
  const [activeTab, setActiveTab] = useState('overview');

  const { stats, salesAnalytics, inventoryAnalytics, customerAnalytics, paymentAnalytics, performanceMetrics, loading, error, fetchAllAnalytics } = useAdminStore();

  useEffect(() => {
    if (!token || !user?.isAdmin) {
      navigate('/login');
      return;
    }
    fetchAllAnalytics();
  }, [token, user, navigate]);

  if (!token || !user?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats Cards
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FaBox,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: FaShoppingCart,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: FaDollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Admin'}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards?.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-semibold">{card.title}</h3>
                  <div className={`${card.color} p-3 rounded-lg text-white`}>
                    <Icon className="text-xl" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 flex flex-wrap">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'sales', label: 'Sales Analytics' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'customers', label: 'Customers' },
              { id: 'payments', label: 'Payments' },
              { id: 'performance', label: 'Performance' },
            ]?.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Metrics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inventory Value</span>
                        <span className="font-semibold">₦{(stats?.totalInventoryValue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Products Low Stock</span>
                        <span className="font-semibold text-red-600">
                          {inventoryAnalytics?.lowStockCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Out of Stock</span>
                        <span className="font-semibold text-red-600">
                          {inventoryAnalytics?.outOfStockCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Users</span>
                        <span className="font-semibold">{stats?.totalUsers || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link to={"/edit/new"} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition block text-center">
                        Add New Product
                      </Link>
                      <Link to={"/admin/products"} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition block text-center">
                        Manage Products
                      </Link>
                      <Link to={"/admin/reviews"} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition block text-center">
                        Review Submissions
                      </Link>
                      <Link to={"/admin/users"} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition block text-center">
                        Manage Users
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Analytics Tab */}
            {activeTab === 'sales' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                    <div className="space-y-3">
                      {salesAnalytics?.topProducts?.slice(0, 5)?.map((product: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">{product._id}</span>
                          <span className="font-semibold">{product.totalOrders} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Performance */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-3">
                      {salesAnalytics?.categoryAnalytics?.slice(0, 5)?.map((cat: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">{cat._id || 'Uncategorized'}</span>
                          <span className="font-semibold">₦{cat.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h2>
                <div className="space-y-4">
                  {/* Low Stock Alert */}
                  {inventoryAnalytics?.lowStockItems?.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex gap-2 items-start">
                        <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-yellow-900">Low Stock Alert</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            {inventoryAnalytics?.lowStockItems?.length} product(s) have low stock levels
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inventory Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-600 text-sm mb-1">Total Inventory Value</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₦{(stats?.totalInventoryValue || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-gray-600 text-sm mb-1">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">
                        {inventoryAnalytics?.outOfStockCount || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-gray-600 text-sm mb-1">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {inventoryAnalytics?.lowStockCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Average Customer LTV</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{(customerAnalytics?.avgLTV || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Repeat Customers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {customerAnalytics?.repeatCustomerCount || 0}
                    </p>
                  </div>

                  {/* Top Customers */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
                    <div className="space-y-2">
                      {customerAnalytics?.topCustomers?.slice(0, 5)?.map((cust: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-3 bg-white border rounded-lg">
                          <span className="text-gray-600">{cust.customerName}</span>
                          <span className="font-semibold">₦{cust.totalSpent.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-600 text-sm mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {(paymentAnalytics?.successRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-gray-600 text-sm mb-1">Failed Payments</p>
                    <p className="text-3xl font-bold text-red-600">
                      {paymentAnalytics?.failedCount || 0}
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-2">
                      {paymentAnalytics?.byMethod?.map((method: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">{method._id}</span>
                          <span className="font-semibold">{method.count} transactions</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Average Order Value</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₦{(performanceMetrics?.avgOrderValue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Orders Per Day</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(performanceMetrics?.ordersPerDay || 0).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(performanceMetrics?.conversionRate || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Cart Abandonment</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(performanceMetrics?.cartAbandonmentRate || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Admin Tools */}
        <AdminTools />
      </div>
    </div>
  );
};

// ─── Admin Tools: Migration + Notifications ──────────────────────────────────
import { apiClient } from '../Api/axiosConfig';
import toast from 'react-hot-toast';

const AdminTools = () => {
  const [migrating, setMigrating] = useState(false);
  const [migResult, setMigResult] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'promo', broadcast: true, userId: '' });

  const runMigration = async () => {
    if (!window.confirm('Run product migration? This will update all existing products with missing fields (brand, rating, images, discount). Continue?')) return;
    setMigrating(true); setMigResult(null);
    try {
      const res = await apiClient.post('/admin/migrate/products');
      setMigResult(res.data.message);
      toast.success('Migration completed!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  const sendNotification = async () => {
    if (!notifForm.title || !notifForm.message) { toast.error('Title and message required'); return; }
    setSending(true);
    try {
      await apiClient.post('/admin/notifications/send', notifForm);
      toast.success(notifForm.broadcast ? 'Notification broadcast to all users!' : 'Notification sent!');
      setNotifForm({ title: '', message: '', type: 'promo', broadcast: true, userId: '' });
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      {/* Migration Tool */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">🔧 Product Migration</h3>
        <p className="text-sm text-gray-500 mb-4">Backfill missing fields (brand, rating, images, discount) on all existing products. Run once after initial setup.</p>
        {migResult && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{migResult}</div>
        )}
        <button
          onClick={runMigration}
          disabled={migrating}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
        >
          {migrating ? <><FaSpinner className="animate-spin" /> Running...</> : '▶ Run Migration'}
        </button>
      </div>

      {/* Send Notification */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">🔔 Send Notification</h3>
        <p className="text-sm text-gray-500 mb-4">Send a notification to all users or a specific user.</p>
        <div className="space-y-3">
          <input
            type="text" placeholder="Title (e.g. 🔥 Weekend Sale!)" value={notifForm.title}
            onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          />
          <textarea
            placeholder="Message..." rows={2} value={notifForm.message}
            onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
          <div className="flex items-center gap-3">
            <select value={notifForm.type} onChange={e => setNotifForm(f => ({ ...f, type: e.target.value }))}
              className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
            >
              <option value="promo">Promo</option>
              <option value="order">Order</option>
              <option value="system">System</option>
              <option value="price_drop">Price Drop</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={notifForm.broadcast} onChange={e => setNotifForm(f => ({ ...f, broadcast: e.target.checked }))}
                className="w-4 h-4 accent-orange-500" />
              Broadcast all
            </label>
          </div>
          {!notifForm.broadcast && (
            <input type="text" placeholder="User ID" value={notifForm.userId}
              onChange={e => setNotifForm(f => ({ ...f, userId: e.target.value }))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
            />
          )}
          <button
            onClick={sendNotification}
            disabled={sending}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            {sending ? <><FaSpinner className="animate-spin" /> Sending...</> : '📤 Send Notification'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
