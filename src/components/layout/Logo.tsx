import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src="/bitcoin.svg" alt="wBTC" className="w-7 h-7 sm:w-8 sm:h-8" />
      <h1 className="text-lg sm:text-xl font-semibold text-text-primary">wBTC</h1>
    </div>
  );
} 