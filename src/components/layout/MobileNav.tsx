import React from 'react';
import { ConnectKitButton } from 'connectkit';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Wallet2 } from 'lucide-react';
import { GetBalanceReturnType } from 'wagmi/actions';

interface MobileNavProps {
  isConnected: boolean;
  isEthereum: boolean;
  ethBalance: GetBalanceReturnType | undefined;
  isEthLoading: boolean;
  isEthError: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function MobileNav({
  isConnected,
  isEthereum,
  ethBalance,
  isEthLoading,
  isEthError,
  sidebarOpen,
  setSidebarOpen,
}: MobileNavProps) {
  return (
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
              {/* Mobile pill: network + wallet button vertically */}
              <div className="flex flex-col items-center gap-4 bg-background border border-card-border rounded-lg p-3 w-full">
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
  );
} 