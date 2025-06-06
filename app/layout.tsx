import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SidebarNav } from '@/components/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { NotificationsProvider } from '@/context/notifications-context';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/ui/notification-bell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PharmStock - Gestion de Stock de Médicaments',
  description: 'Application de gestion de stock de médicaments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
                <div>
                  {children}
                </div>
        </ThemeProvider>
      </body>
    </html>
  );
}