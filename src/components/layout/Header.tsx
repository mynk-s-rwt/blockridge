'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount, useBalance } from 'wagmi';

export function Header() {
  const { isConnected, chainId, address } = useAccount();
  const isEthereum = isConnected && chainId === 1;
  // Fetch ETH balance
  const { data: ethBalance, isLoading: isEthLoading, isError: isEthError } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 flex justify-between items-center bg-primary-background shadow-md backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <img src="/bitcoin.svg" alt="wBTC" className="w-8 h-8" />
        <h1 className="text-xl font-semibold text-text-primary">wBTC</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className={`flex items-center h-10 px-4 rounded-full text-sm font-semibold bg-card-bg border border-card-border select-none pointer-events-none gap-2 min-w-[120px] justify-center mr-4`}>
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
        <ConnectKitButton
          showAvatar={false}
          showBalance={false}
        />
      </div>
    </header>
  );
} 