"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  TruckIcon,
  PackageSearch,
  PackageCheck,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { NotificationBell } from '@/components/ui/notification-bell';
import { DialogTitle } from '@/components/ui/dialog';

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      icon: LayoutDashboard,
      title: "Tableau de bord",
    },
    {
      href: "/medicaments",
      icon: Pill,
      title: "Médicaments",
    },
    {
      href: "/mouvements",
      icon: PackageSearch,
      title: "Mouvements",
    },
    {
      href: "/fournisseurs",
      icon: TruckIcon,
      title: "Fournisseurs",
    },
  ];

  const NavLinks = () => (
    <div className="flex flex-col gap-1 px-2">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => setOpen(false)}
          >
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "transparent"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{route.title}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="absolute left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-10 w-64 max-w-full flex flex-col">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center py-4 border-b">
              <PackageCheck className="h-6 w-6 mr-2" />
              <span className="font-semibold">PharmStock</span>
            </div>
            <div className="sr-only">
              <DialogTitle>Menu principal</DialogTitle>
            </div>
            <div className="flex flex-col gap-4 h-full">
              <div className="flex flex-row items-center justify-between px-4 py-2">
                <span className="font-bold text-lg">Menu</span>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="py-4">
                  <NavLinks />
                </div>
              </ScrollArea>
              <div className="flex justify-start my-6 pl-2">
                <div className="h-7 w-7">
                  <NotificationBell />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-muted-foreground">v1.0.0</span>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className={cn("hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0", className)}>
        <div className="flex-1 flex flex-col min-h-0 border-r">
          <div className="flex items-center h-16 justify-center px-4 border-b">
            <PackageCheck className="h-6 w-6 mr-2" />
            <span className="font-semibold">PharmStock</span>
          </div>
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-row items-center justify-between px-4 py-2">
              <span className="font-bold text-lg">Menu</span>
            </div>
            <ScrollArea className="flex-1">
              <NavLinks />
            </ScrollArea>
            <div className="flex justify-start my-6 pl-2">
              <div className="h-7 w-7">
                <NotificationBell />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">v1.0.0</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}