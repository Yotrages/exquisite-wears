import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { apiClient } from '../Api/axiosConfig';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const token = useSelector((state: any) => state.authSlice.token);
  const user = useSelector((state: any) => state.authSlice.user);

  useEffect(() => {
    if (!token || !user) {
      // Disconnect if no auth
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket reconnect attempt:', attemptNumber);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
      setConnectionError('Failed to reconnect');
    });

    // Cleanup on unmount or token/user change
    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, [token, user]);

  // Emit helper
  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }, []);

  // Listen helper
  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      return () => socketRef.current?.off(event, handler);
    }
    return () => {};
  }, []);

  // Off helper
  const off = useCallback((event: string, handler?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    off,
  };
};

// Hook specifically for notifications
export const useNotificationSocket = () => {
  const { on, isConnected, emit } = useSocket();
  const user = useSelector((state: any) => state.authSlice.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<any>(null);

  // Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/notifications?limit=1');
      const unread = res.data.unreadCount || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial count
    fetchUnreadCount();

    // Listen for new notifications
    const handleNewNotification = (notification: any) => {
      console.log('📬 New notification received:', notification);
      setLatestNotification(notification);
      setUnreadCount(prev => prev + 1);

      // Show toast
      import('react-hot-toast').then(({ toast }) => {
        toast.success(notification.title, {
          duration: 5000,
          icon: '🔔',
        });
      });
    };

    const handleBroadcastNotification = (notification: any) => {
      console.log('📢 Broadcast notification received:', notification);
      setLatestNotification(notification);
      setUnreadCount(prev => prev + 1);

      import('react-hot-toast').then(({ toast }) => {
        toast.success(notification.title, {
          duration: 5000,
          icon: '📢',
        });
      });
    };

    const handleNotificationRead = (_notificationId: string) => {
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleNotificationReadAll = () => {
      setUnreadCount(0);
    };

    const unsubNew = on('notification:new', handleNewNotification);
    const unsubBroadcast = on('notification:broadcast', handleBroadcastNotification);
    const unsubRead = on('notification:read', handleNotificationRead);
    const unsubReadAll = on('notification:readAll', handleNotificationReadAll);

    return () => {
      unsubNew();
      unsubBroadcast();
      unsubRead();
      unsubReadAll();
    };
  }, [user, on, fetchUnreadCount]);

  // Mark notification as read (sync across tabs)
  const markAsRead = useCallback((notificationId: string) => {
    emit('notification:read', notificationId);
  }, [emit]);

  // Mark all as read (sync across tabs)
  const markAllAsRead = useCallback(() => {
    emit('notification:readAll', undefined);
  }, [emit]);

  return {
    isConnected,
    unreadCount,
    latestNotification,
    markAsRead,
    markAllAsRead,
    refetch: fetchUnreadCount,
  };
};

// Hook for admin notifications
export const useAdminNotificationSocket = () => {
  const { on, isConnected } = useSocket();
  const user = useSelector((state: any) => state.authSlice.user);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    const handleAdminNotification = (notification: any) => {
      console.log('👑 Admin notification received:', notification);
      setAdminNotifications(prev => [notification, ...prev].slice(0, 50));

      import('react-hot-toast').then(({ toast }) => {
        toast.success('New notification sent', {
          duration: 3000,
          icon: '📤',
        });
      });
    };

    const unsub = on('admin:notification', handleAdminNotification);

    return () => {
      unsub();
    };
  }, [user, on]);

  return {
    isConnected,
    adminNotifications,
  };
};