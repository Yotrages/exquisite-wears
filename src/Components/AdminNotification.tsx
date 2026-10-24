import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  FaBell, FaEnvelope, FaPaperPlane, FaSpinner, FaCheck,
  FaLayerGroup, FaEye, FaChevronRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { apiClient } from '../Api/axiosConfig';
import { useAdminNotificationSocket } from '../hooks/useSocket';
import { Notifications, NotificationSchema } from '../Schema/Notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const AdminNotification = () => {
  const { user } = useSelector((state: any) => state.authSlice);
  const navigate = useNavigate();
  const { adminNotifications, isConnected } = useAdminNotificationSocket();

  if (!user?.isAdmin) return <Navigate to="/" replace />;

  // Email notification form (for subscribers)
  const {
    formState: { errors: emailErrors },
    handleSubmit: handleEmailSubmit,
    register: registerEmail,
    reset: resetEmail,
  } = useForm<Notifications>({ resolver: zodResolver(NotificationSchema) });

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // In-app notification form (for users)
  const [inAppForm, setInAppForm] = useState({
    title: '',
    message: '',
    type: 'promo',
    broadcast: true,
    userId: '',
  });
  const [inAppLoading, setInAppLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'email' | 'inapp' | 'history'>('email');

  // Email notification submit
  const handleEmailNotify = async (items: Notifications) => {
    setEmailLoading(true);
    try {
      const res = await apiClient.post('/subscribe/notify', items);
      if (res.status === 200 || res.status === 207) {
        setEmailLoading(false);
        setEmailSuccess(true);
        toast.success(res.status === 207
          ? `Notification sent! ${res.data.failedEmails?.length || 0} emails failed`
          : 'Email notification sent to all subscribers!');
        resetEmail();
        setTimeout(() => setEmailSuccess(false), 3000);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to send email notification';
      toast.error(errorMsg);
      setEmailLoading(false);
    }
  };

  // In-app notification submit
  const handleInAppNotify = async () => {
    if (!inAppForm.title || !inAppForm.message) {
      toast.error('Title and message are required');
      return;
    }
    setInAppLoading(true);
    try {
      await apiClient.post('/admin/notifications/send', inAppForm);
      toast.success(inAppForm.broadcast
        ? 'In-app notification broadcast to all users!'
        : 'In-app notification sent to user!');
      setInAppForm({ title: '', message: '', type: 'promo', broadcast: true, userId: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send in-app notification');
    } finally {
      setInAppLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    promo: '📢 Promo',
    order: '📦 Order',
    system: '⚙️ System',
    price_drop: '💰 Price Drop',
    delivery: '🚚 Delivery',
    review: '⭐ Review',
    restock: '📥 Restock',
  };

  const typeColors: Record<string, string> = {
    promo: 'bg-pink-100 text-pink-700',
    order: 'bg-orange-100 text-orange-700',
    system: 'bg-gray-100 text-gray-700',
    price_drop: 'bg-green-100 text-green-700',
    delivery: 'bg-blue-100 text-blue-700',
    review: 'bg-yellow-100 text-yellow-700',
    restock: 'bg-purple-100 text-purple-700',
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
            <FaChevronRight className="text-sm" />
            <span className="text-gray-900 font-medium">Notifications</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <FaBell className="text-2xl text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Notification Center
                </h1>
                <p className="text-gray-500 text-sm mt-1">Send notifications to subscribers and users</p>
              </div>
            </div>
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 flex flex-wrap">
            {[
              { id: 'email', label: 'Email to Subscribers', icon: FaEnvelope, count: null },
              { id: 'inapp', label: 'In-App to Users', icon: FaBell, count: null },
              { id: 'history', label: 'Recent Sent', icon: FaLayerGroup, count: adminNotifications.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-orange-500 border-orange-500 bg-orange-50'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="p-6">
            {/* Email to Subscribers Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-orange-500 text-xl mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">Email Newsletter Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Send HTML emails to all newsletter subscribers. Uses Gmail SMTP for delivery.
                        Includes 500ms delay between emails to avoid rate limits.
                      </p>
                    </div>
                  </div>
                </div>

                {emailSuccess && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-slide-up">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-3xl text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                      <p className="text-gray-500 text-sm mb-6">Notification sent to all subscribers successfully.</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEmailSuccess(false)}
                          className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
                        >
                          Send Another
                        </button>
                        <button
                          onClick={() => { setEmailSuccess(false); navigate('/dashboard'); }}
                          className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleEmailSubmit(handleEmailNotify)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5" htmlFor="subject">
                      Email Subject
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        {...registerEmail('subject')}
                        id="subject"
                        placeholder="e.g. New arrivals just dropped 🔥"
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
                      />
                    </div>
                    {emailErrors.subject && (
                      <p className="text-red-500 text-xs mt-1">{emailErrors.subject.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5" htmlFor="message">
                      Message Body
                    </label>
                    <textarea
                      {...registerEmail('message')}
                      id="message"
                      rows={8}
                      placeholder="Write your notification message here... HTML is supported."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none font-mono text-xs"
                    />
                    {emailErrors.message && (
                      <p className="text-red-500 text-xs mt-1">{emailErrors.message.message as string}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">HTML supported. The message will be wrapped in the standard email template.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-md shadow-orange-200 text-sm"
                  >
                    {emailLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending to all subscribers...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Email Notification
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* In-App to Users Tab */}
            {activeTab === 'inapp' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <FaBell className="text-blue-500 text-xl mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">In-App Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Send real-time in-app notifications to all users or a specific user.
                        Notifications appear instantly in the user's notification bell and notification page.
                        Delivered via WebSocket for real-time updates across all open tabs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🔥 Weekend Sale - 50% Off!"
                      value={inAppForm.title}
                      onChange={e => setInAppForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1.5">
                      Message
                    </label>
                    <textarea
                      placeholder="Write your notification message..."
                      rows={4}
                      value={inAppForm.message}
                      onChange={e => setInAppForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <select
                        value={inAppForm.type}
                        onChange={e => setInAppForm(f => ({ ...f, type: e.target.value }))}
                        className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 min-w-[160px]"
                      >
                        <option value="promo">📢 Promo</option>
                        <option value="order">📦 Order</option>
                        <option value="system">⚙️ System</option>
                        <option value="price_drop">💰 Price Drop</option>
                        <option value="delivery">🚚 Delivery</option>
                        <option value="review">⭐ Review</option>
                        <option value="restock">📥 Restock</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={inAppForm.broadcast}
                        onChange={e => setInAppForm(f => ({ ...f, broadcast: e.target.checked }))}
                        className="w-4 h-4 accent-orange-500"
                      />
                      Broadcast to all users
                    </label>
                  </div>

                  {!inAppForm.broadcast && (
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1.5">
                        User ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter user ID (MongoDB ObjectId)"
                        value={inAppForm.userId}
                        onChange={e => setInAppForm(f => ({ ...f, userId: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors"
                      />
                      <p className="text-xs text-gray-400 mt-1">Find user IDs in the Users management section.</p>
                    </div>
                  )}

                  <button
                    onClick={handleInAppNotify}
                    disabled={inAppLoading}
                    className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    {inAppLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send In-App Notification
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Broadcast Notifications</h3>
                  <span className="text-sm text-gray-500">{adminNotifications.length} recent</span>
                </div>

                {adminNotifications.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center">
                    <FaLayerGroup className="text-4xl text-gray-200 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 mb-1">No notifications sent yet</h4>
                    <p className="text-gray-500 text-sm">Broadcast notifications will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {adminNotifications.map((notif: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-100 p-4 hover:border-orange-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColors[notif.type] || typeColors.system}`}
                              >
                                {typeLabels[notif.type] || notif.type}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(notif.createdAt).toLocaleString()}
                              </span>
                              {notif.broadcast && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                  Broadcast
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900 mb-1">{notif.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{notif.message}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors" title="View">
                              <FaEye className="text-sm" />
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors" title="Resend">
                              <FaPaperPlane className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminNotification;