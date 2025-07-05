'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount, useBalance } from 'wagmi';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Wallet2 } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { TOKENS } from '@/lib/config';

export function Header() {
  const { isConnected, chainId, address } = useAccount();
  const isEthereum = isConnected && chainId === 1;

  // Fetch ETH balance (moved here to be shared)
  const { data: ethBalance, isLoading: isEthLoading, isError: isEthError } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full py-3 px-3 sm:py-4 sm:px-6 flex flex-row justify-between items-center bg-primary-background shadow-md backdrop-blur-lg z-20">
      {/* Left: Logo and title */}
      <Logo />
      {/* Desktop: show network pill and wallet button inline */}
      <DesktopNav isConnected={isConnected} isEthereum={isEthereum} ethBalance={ethBalance} isEthLoading={isEthLoading} isEthError={isEthError} />
      {/* Mobile: wallet icon on right */}
      <MobileNav isConnected={isConnected} isEthereum={isEthereum} ethBalance={ethBalance} isEthLoading={isEthLoading} isEthError={isEthError} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </header>
  );
} 