'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Ocultar Header y Footer en rutas del admin
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }
  
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}