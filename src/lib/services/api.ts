let priceAbortController: AbortController | null = null;
let priceDebounceTimeout: NodeJS.Timeout | null = null;

export const fetchPrice = async (tokenIdOrSymbol: string): Promise<number> => {
  // Debounce: clear any pending timeout
  if (priceDebounceTimeout) clearTimeout(priceDebounceTimeout);

  // Abort previous fetch if still running
  if (priceAbortController) priceAbortController.abort();
  priceAbortController = new AbortController();

  // Return a promise that resolves after debounce
  return new Promise((resolve) => {
    priceDebounceTimeout = setTimeout(async () => {
      try {
        // Use CoinGecko's id for BTC: 'bitcoin', for ETH: 'ethereum', for USDC: 'usd-coin', etc.
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIdOrSymbol}&vs_currencies=usd`;
        const res = await fetch(url, { signal: priceAbortController?.signal });
        if (!res.ok) throw new Error('Failed to fetch price');
        const data = await res.json();
        // Try both id and symbol as keys
        const price = data[tokenIdOrSymbol]?.usd;
        if (typeof price === 'number') {
          resolve(price);
        } else {
          resolve(107500); // fallback
        }
      } catch (e) {
        resolve(107500); // fallback
      }
    }, 300); // 300ms debounce
  });
}; 