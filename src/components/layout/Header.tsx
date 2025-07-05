'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

export function Header() {
  const { isConnected, chainId } = useAccount();
  const isEthereum = isConnected && chainId === 1;
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-primary-background shadow-md backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <img src="/bitcoin.svg" alt="wBTC" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-text-primary">wBTC Converter</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className={`flex items-center px-5 py-2 rounded-full text-base font-semibold bg-card-bg border border-card-border select-none pointer-events-none gap-3 min-w-[130px] justify-center`}>
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isEthereum ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          Ethereum
        </div>
        <ConnectKitButton/>
      </div>
    </header>
  );
} 