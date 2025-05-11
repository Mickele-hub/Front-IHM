"use client"
// import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SidebarNav } from '@/components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { NotificationsProvider } from '@/context/notifications-context';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NotificationBell } from '@/components/ui/notification-bell';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationsProvider>
            <div className="relative md:flex md:min-h-screen">
              <SidebarNav />
              <div className="flex-1 md:pl-64">
                <div className="p-6 md:p-8 relative">
                  {children}
                  <Toaster />
                </div>
              </div>
            </div>
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}