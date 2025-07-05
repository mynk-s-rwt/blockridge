import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-1inch-gradient">
      <Header />
      <main className="container mx-auto px-4 pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        {children}
      </main>
    </div>
  );
} 