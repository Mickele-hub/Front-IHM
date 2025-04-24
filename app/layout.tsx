import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SidebarNav } from '@/components/sidebar-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

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
          <div className="relative md:flex md:min-h-screen">
            <SidebarNav />
            <div className="flex-1 md:pl-64">
              <div className="p-6 md:p-8">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}