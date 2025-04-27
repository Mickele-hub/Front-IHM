'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const isLoginPage = pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
      router.replace('/login');
    }
  }, [pathname]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative md:flex md:min-h-screen">
        {pathname !== '/login' && <SidebarNav />}
        <div className={pathname !== '/login' ? "flex-1 md:pl-64" : "flex-1"}>
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
