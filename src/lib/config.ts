export const TOKENS = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // wBTC mainnet
    logoURI: '/bitcoin.svg',
    decimals: 8,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC mainnet
    logoURI: '/usdc.svg',
    decimals: 6,
  }
};

export const NETWORKS = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    logoURI: '/ethereum.svg',
  },
  // Add more networks as needed
]; 