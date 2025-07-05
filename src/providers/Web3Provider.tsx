'use client';

import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'wBTC Converter',
    // Get your Wallet Connect Project ID from https://cloud.walletconnect.com
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [mainnet],
  }),
);

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider theme="midnight">
          {children}
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 