'use client';

import { Bell } from "lucide-react";
import { useNotifications } from "@/context/notifications-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const { notifications, markAllAsRead, clearNotifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Notifications</span>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={markAllAsRead}>Tout marquer comme lu</Button>
            <Button size="sm" variant="destructive" onClick={clearNotifications}>Vider</Button>
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y">
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">Aucune notification</div>
          )}
          {notifications.map((n) => (
            <div key={n.id} className={`py-2 px-1 ${!n.read ? "bg-muted/30" : ""}`}>
              <div className="flex items-center gap-2">
                {n.type === "stock_critique" && <span className="text-red-600">⚠️</span>}
                {n.type === "mouvement" && <span className="text-blue-600">🔄</span>}
                {n.type === "fournisseur_add" && <span className="text-green-600">➕</span>}
                {n.type === "fournisseur_delete" && <span className="text-red-500">🗑️</span>}
                <span className="font-medium">{n.title}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{n.description}</div>
              <div className="text-xs text-right text-gray-400 mt-1">{n.date.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
