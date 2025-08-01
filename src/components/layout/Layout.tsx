import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-1inch-gradient">
      <Header />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
} 