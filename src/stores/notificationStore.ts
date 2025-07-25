import { create } from 'zustand';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  createdAt: Date;
  relatedBookingId?: string;
  relatedRequestId?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  getNotificationsByUser: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}`,
      createdAt: new Date(),
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },

  markAllAsRead: (userId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.userId === userId
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  getUnreadCount: (userId) => {
    const { notifications } = get();
    return notifications.filter(
      (notification) => notification.userId === userId && !notification.read
    ).length;
  },

  getNotificationsByUser: (userId) => {
    const { notifications } = get();
    return notifications.filter((notification) => notification.userId === userId);
  },
}));