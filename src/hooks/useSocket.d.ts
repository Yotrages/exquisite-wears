import { Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  emit: (event: string, data: any) => void;
  on: (event: string, handler: (data: any) => void) => () => void;
  off: (event: string, handler?: (data: any) => void) => void;
}

export declare const useSocket: () => UseSocketReturn;

export interface UseNotificationSocketReturn {
  isConnected: boolean;
  unreadCount: number;
  latestNotification: any;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refetch: () => Promise<void>;
}

export declare const useNotificationSocket: () => UseNotificationSocketReturn;

export interface UseAdminNotificationSocketReturn {
  isConnected: boolean;
  adminNotifications: any[];
}

export declare const useAdminNotificationSocket: () => UseAdminNotificationSocketReturn;