"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { NotificationItem, NotificationType } from "@/types";
import { useAuth } from "./auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  fetchNotificationsFromDB,
  insertNotificationToDB,
  markNotificationReadInDB,
  markAllNotificationsReadInDB,
  deleteNotificationFromDB
} from "@/lib/supabase/queries";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  createNotification: (notif: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    iconName?: string;
    color?: string;
    href?: string;
    metadata?: Record<string, any>;
  }) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      if (!user) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await fetchNotificationsFromDB(user.id);
      if (isMounted && data) {
        setNotifications(data);
      }
      if (isMounted) setIsLoading(false);
    }

    loadNotifications();

    if (user) {
      // Supabase Realtime Subscription
      const channel = supabase
        .channel("public:notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (isMounted) {
              const newRecord = payload.new;
              const newNotif: NotificationItem = {
                id: newRecord.id,
                userId: newRecord.user_id,
                type: newRecord.type as NotificationType,
                title: newRecord.title,
                message: newRecord.message,
                iconName: newRecord.icon_name,
                color: newRecord.color,
                href: newRecord.href,
                metadata: newRecord.metadata,
                isRead: newRecord.is_read,
                createdAt: newRecord.created_at,
              };

              setNotifications((prev) => [newNotif, ...prev]);

              // Show toast
              toast(newNotif.title, {
                description: newNotif.message,
                action: newNotif.href
                  ? {
                      label: "Lihat",
                      onClick: () => {
                        window.location.href = newNotif.href!;
                      },
                    }
                  : undefined,
              });
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationReadInDB(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsReadInDB(user.id);
    toast.success("Semua notifikasi ditandai sudah dibaca");
  }, [user]);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotificationFromDB(id);
  }, []);

  const createNotification = useCallback(
    async (notif: {
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      iconName?: string;
      color?: string;
      href?: string;
      metadata?: Record<string, any>;
    }) => {
      await insertNotificationToDB(notif);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
