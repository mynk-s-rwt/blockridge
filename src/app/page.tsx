'use client';

import { Layout } from '@/components/layout/Layout';
import { Converter } from '@/components/sections/Converter';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
        <h2 className="text-lg md:text-2xl font-semibold text-text-primary mb-6">
          Wrapped Bitcoin (wBTC) converter
        </h2>
        <Converter />
      </div>
    </Layout>
  );
}
