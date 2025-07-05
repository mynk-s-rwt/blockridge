'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount, useBalance } from 'wagmi';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Wallet2 } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { isConnected, chainId, address } = useAccount();
  const isEthereum = isConnected && chainId === 1;
  // Fetch ETH balance
  const { data: ethBalance, isLoading: isEthLoading, isError: isEthError } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full py-3 px-3 sm:py-4 sm:px-6 flex flex-row justify-between items-center bg-primary-background shadow-md backdrop-blur-lg z-20">
      {/* Left: Logo and title */}
      <div className="flex items-center gap-2">
        <img src="/bitcoin.svg" alt="wBTC" className="w-7 h-7 sm:w-8 sm:h-8" />
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary">wBTC</h1>
      </div>
      {/* Desktop: show network pill and wallet button inline */}
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
      {/* Mobile: wallet icon on right */}
      <div className="flex sm:hidden items-center">
        <Dialog open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DialogTrigger asChild>
            <button aria-label="Open wallet sidebar" className="p-2 rounded-full hover:bg-card-bg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden">
              <Wallet2 className="w-6 h-6 text-text-primary" />
            </button>
          </DialogTrigger>
          <DialogContent showCloseButton={true} sidebar={true} className="fixed right-0 top-0 h-full w-64 max-w-[80vw] rounded-none border-0 p-0 bg-card-bg flex flex-col z-50 shadow-2xl">
            <div className="flex flex-col gap-6 p-6 h-full justify-between">
              <div className="flex flex-col gap-4 mt-4">
                {/* Mobile pill: network + wallet button horizontally */}
                <div className="flex flex-row items-center gap-2 bg-background border border-card-border rounded-full px-3 py-2 w-full justify-center">
                  <div className={`flex items-center h-9 rounded-full text-xs font-semibold select-none pointer-events-none gap-2 min-w-[100px] justify-center`}>
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
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
} 