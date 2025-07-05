import React from 'react';
import { ConnectKitButton } from 'connectkit';
import { GetBalanceReturnType } from 'wagmi/actions';
import { TOKENS } from '@/lib/config';

interface DesktopNavProps {
  isConnected: boolean;
  isEthereum: boolean;
  ethBalance: GetBalanceReturnType | undefined;
  isEthLoading: boolean;
  isEthError: boolean;
}

export function DesktopNav({
  isConnected,
  isEthereum,
  ethBalance,
  isEthLoading,
  isEthError,
}: DesktopNavProps) {
  return (
    <div className="hidden sm:flex flex-row items-center gap-6 ml-auto">
      <div className={`flex items-center h-9 sm:h-10 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold bg-card-bg border border-card-border select-none pointer-events-none gap-2 min-w-[100px] sm:min-w-[120px] justify-center sm:mr-4`}>
        <span className={`inline-block w-2 h-2 rounded-full ${isEthereum ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        <span>Ethereum</span>
        {isConnected && (
          <>
            <span className="mx-1">|</span>
            <img src="/ethereum.svg" alt="ETH" className="w-4 h-4" />
            <span className="ml-1">{isEthLoading ? '...' : isEthError ? 'Error' : ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)}` : '--'}</span>
          </>
        )}
      </div>
      <ConnectKitButton showAvatar={false} showBalance={false} />
    </div>
  );
} 