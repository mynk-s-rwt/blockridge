'use client';

import { ConnectKitButton } from 'connectkit';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-primary-background shadow-md">
      <div className="flex items-center gap-2">
        <img src="/bitcoin.svg" alt="wBTC" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-text-primary">wBTC Converter</h1>
      </div>
      <ConnectKitButton />
    </header>
  );
} 