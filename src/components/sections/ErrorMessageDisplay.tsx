import React from 'react';

interface ErrorMessageDisplayProps {
  error: boolean;
  isUsdcError: boolean;
  isWbtcError: boolean;
}

export function ErrorMessageDisplay({
  error,
  isUsdcError,
  isWbtcError,
}: ErrorMessageDisplayProps) {
  if (!error && !isUsdcError && !isWbtcError) {
    return null; // Don't render if no errors
  }

  return (
    <div className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded px-3 py-2">
      {error && 'Failed to fetch price data. Please try again later.'}
      {isUsdcError && 'Failed to fetch USDC balance. Please check your wallet or try again.'}
      {isWbtcError && 'Failed to fetch wBTC balance. Please check your wallet or try again.'}
    </div>
  );
} 