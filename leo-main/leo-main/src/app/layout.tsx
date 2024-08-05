'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/context/SidebarProvider';
import { AuthProvider } from '@/context/AuthContextProvider';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import Loading from './loading';
import { ThemeContextProvider } from '@/context/ThemeContextProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-backgroundColor">
      <title>{process.env.NEXT_PUBLIC_PAGE_NAME}</title>
      <body className={inter.className}>
        <Toaster />
        <Suspense fallback={<Loading />}>
          <ThemeContextProvider>
            <AuthProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </ThemeContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
