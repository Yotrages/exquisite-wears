import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  FaBell, FaBox, FaTag, FaStar, FaTruck, FaCog, FaTrash, FaCheck, FaCheckDouble
} from 'react-icons/fa'
import { MdNotificationsNone } from 'react-icons/md'
import { format } from 'date-fns'
import { apiClient } from '../Api/axiosConfig'
import Layout from '../Components/Layout'
import toast from 'react-hot-toast'

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  order:      { icon: <FaBox />,    color: 'text-orange-600',  bg: 'bg-orange-100' },
  delivery:   { icon: <FaTruck />,  color: 'text-blue-600',    bg: 'bg-blue-100'   },
  promo:      { icon: <FaTag />,    color: 'text-pink-600',    bg: 'bg-pink-100'   },
  price_drop: { icon: <FaTag />,    color: 'text-green-600',   bg: 'bg-green-100'  },
  review:     { icon: <FaStar />,   color: 'text-yellow-600',  bg: 'bg-yellow-100' },
  system:     { icon: <FaCog />,    color: 'text-gray-600',    bg: 'bg-gray-100'   },
  restock:    { icon: <FaBox />,    color: 'text-purple-600',  bg: 'bg-purple-100' },
}

const NotificationPage = () => {
  const { user } = useSelector((state: any) => state.authSlice)
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!user) return <Navigate to="/login" replace />

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/notifications?limit=50')
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unreadCount || 0)
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {})
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { }
  }

  const markAllRead = async () => {
    try {
      await apiClient.put('/notifications/all/read', {})
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  const deleteOne = async (id: string) => {
    try {
      await apiClient.delete(`/notifications/${id}`)
      const removed = notifications.find(n => n._id === id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (removed && !removed.read) setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const deleteAll = async () => {
    if (!window.confirm('Clear all notifications?')) return
    try {
      await apiClient.delete('/notifications/all')
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications cleared')
    } catch {
      toast.error('Failed to clear notifications')
    }
  }

  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Notifications</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FaBell className="text-orange-500 text-lg" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-orange-500 font-semibold">{unreadCount} unread</p>
                  )}
                </div>
              </div>
              {user?.isAdmin && (
                <Link
                  to="/admin/notifications"
                  className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all"
                >
                  Send Notification
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex gap-2">
              {(['all', 'unread'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filter === f
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
                  }`}
                >
                  {f === 'all' ? 'All' : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                >
                  <FaCheckDouble className="text-xs" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={deleteAll}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <FaTrash className="text-xs" /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <MdNotificationsNone className="text-5xl text-orange-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {filter === 'unread' ? "You're all caught up!" : 'Notifications about your orders and promotions will appear here.'}
              </p>
              {filter === 'unread' && notifications.length > 0 && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  View All
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {displayed.map((notif: any) => {
                const cfg = typeConfig[notif.type] || typeConfig.system
                return (
                  <div
                    key={notif._id}
                    className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                      !notif.read
                        ? 'border-orange-200 bg-orange-50/30 shadow-sm'
                        : 'border-gray-100'
                    }`}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif._id)
                      if (notif.link) navigate(notif.link)
                    }}
                  >
                    <div className="flex items-start gap-4 p-5">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {!notif.read && <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 mb-0.5" />}
                            {notif.title}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{notif.message}</p>
                        {notif.link && (
                          <p className="text-xs text-orange-500 font-semibold mt-1.5">Tap to view →</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead(notif._id) }}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                            title="Mark as read"
                          >
                            <FaCheck className="text-xs" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteOne(notif._id) }}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Link to preferences */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Notification Settings</p>
              <p className="text-xs text-gray-500 mt-0.5">Control what you're notified about</p>
            </div>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all"
            >
              <FaCog className="text-xs" /> Manage
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotificationPage
