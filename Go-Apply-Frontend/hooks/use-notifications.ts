import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = async (): Promise<void> => {
    try {
      setLoading(true);

      const token = localStorage
        .getItem("authToken")
        ?.replace(/^"|"$/g, "")
        .trim();

      const response = await axios.get<NotificationsResponse>(
        `${API_URL}/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
       console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      const token = localStorage
        .getItem("authToken")
        ?.replace(/^"|"$/g, "")
        .trim();

      await axios.post(
        `${API_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update UI state
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
       console.error("Error marking notifications as read:", error);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsRead,
  };
};
