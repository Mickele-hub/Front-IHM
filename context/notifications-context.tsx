'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";

export type NotificationType =
  | "stock_critique"
  | "mouvement"
  | "fournisseur_add"
  | "fournisseur_delete"
  | "success";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

interface NotificationsContextProps {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, "id" | "read" | "date">) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function addNotification(notif: Omit<Notification, "id" | "read" | "date">) {
    setNotifications((prev) => [
      {
        ...notif,
        id: Math.random().toString(36).slice(2),
        read: false,
        date: new Date(),
      },
      ...prev,
    ]);
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearNotifications() {
    setNotifications([]);
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAllAsRead, clearNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
