import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { TOKENS } from '@/lib/config';
import { usePrice } from '@/lib/hooks/use-price';
import { useDebounce } from '@/lib/hooks/use-debounce';

const FALLBACK_BTC_PRICE = 107500;

export function Converter() {
  const { isConnected } = useAccount();
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [wbtcAmount, setWbtcAmount] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'usd' | 'wbtc' | null>(null);
  const [pendingOutput, setPendingOutput] = useState<string>('');
  const { usdPrice, isLoading, error, refetch } = usePrice('bitcoin');

  const debouncedUsdAmount = useDebounce(usdAmount, 300);
  const debouncedWbtcAmount = useDebounce(wbtcAmount, 300);

  // Always use the latest price, fallback only if error
  const currentPrice = error ? FALLBACK_BTC_PRICE : usdPrice;

  // Refetch price when debounced input changes
  useEffect(() => {
    if (debouncedUsdAmount || debouncedWbtcAmount) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsdAmount, debouncedWbtcAmount]);

  // Only update output when price is available and not loading
  useEffect(() => {
    if (!isLoading && !error && activeInput) {
      if (activeInput === 'usd') {
        if (debouncedUsdAmount && !isNaN(parseFloat(debouncedUsdAmount)) && currentPrice) {
          const btcValue = parseFloat(debouncedUsdAmount) / currentPrice;
          setWbtcAmount(btcValue.toFixed(8));
        } else {
          setWbtcAmount('');
        }
      } else if (activeInput === 'wbtc') {
        if (debouncedWbtcAmount && !isNaN(parseFloat(debouncedWbtcAmount)) && currentPrice) {
          const usdValue = parseFloat(debouncedWbtcAmount) * currentPrice;
          setUsdAmount(usdValue.toFixed(2));
        } else {
          setUsdAmount('');
        }
      }
      setPendingOutput('');
      setActiveInput(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error, usdPrice, debouncedUsdAmount, debouncedWbtcAmount]);

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    setActiveInput('usd');
    setWbtcAmount(''); // Clear output while loading
    setPendingOutput('...');
  };

  const handleWbtcChange = (value: string) => {
    setWbtcAmount(value);
    setActiveInput('wbtc');
    setUsdAmount(''); // Clear output while loading
    setPendingOutput('...');
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card-bg border border-card-border shadow-card rounded-card">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            USD Amount
          </label>
          <div className="relative flex items-center">
            <Input
              type="text"
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="Enter USD amount"
              value={activeInput === 'wbtc' && isLoading ? pendingOutput : usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow pr-12"
              disabled={isLoading || !!error}
            />
            {isLoading && (
              <span className="absolute right-10 flex items-center justify-center">
                <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
              </span>
            )}
            <img
              src={TOKENS.USDC.logoURI}
              className="absolute right-3 w-7 h-7"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            wBTC Amount
          </label>
          <div className="relative flex items-center">
            <Input
              type="text"
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="Enter wBTC amount"
              value={activeInput === 'usd' && isLoading ? pendingOutput : wbtcAmount}
              onChange={(e) => handleWbtcChange(e.target.value)}
              className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow pr-12"
              disabled={isLoading || !!error}
            />
            {isLoading && (
              <span className="absolute right-10 flex items-center justify-center">
                <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>
              </span>
            )}
            <img
              src={TOKENS.BTC.logoURI}
              className="absolute right-3 w-7 h-7"
            />
          </div>
        </div>

        <Button
          className="w-full bg-button-primary text-button-primary-text rounded-button shadow-none hover:bg-button-primary-hover disabled:bg-button-primary-disabled-bg disabled:text-button-primary-disabled-text focus:border-button-primary-focus-border focus:shadow-button-primary-focus-shadow"
          disabled={!isConnected || (!usdAmount && !wbtcAmount) || isLoading || !!error}
        >
          {isLoading ? (
            <span className="flex items-center justify-center"><span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>Loading price...</span>
          ) : error ? (
            'Price unavailable'
          ) : isConnected ? 'Convert to wBTC' : 'Connect Wallet to Convert'}
        </Button>

        {error && (
          <p className="text-sm text-red-500 text-center">Failed to fetch BTC price. Using fallback: ${FALLBACK_BTC_PRICE.toLocaleString()}</p>
        )}
      </div>
    </Card>
  );
} 