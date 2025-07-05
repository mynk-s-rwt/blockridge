import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

export function Converter() {
  const { isConnected } = useAccount();
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [wbtcAmount, setWbtcAmount] = useState<string>('');

  // Mock BTC price - In a real app, this would come from an API
  const btcPrice = 65000;

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const btcValue = parseFloat(value) / btcPrice;
      setWbtcAmount(btcValue.toFixed(8));
    } else {
      setWbtcAmount('');
    }
  };

  const handleWbtcChange = (value: string) => {
    setWbtcAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const usdValue = parseFloat(value) * btcPrice;
      setUsdAmount(usdValue.toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card-bg border border-card-border shadow-card rounded-card">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            USD Amount
          </label>
          <Input
            type="number"
            placeholder="Enter USD amount"
            value={usdAmount}
            onChange={(e) => handleUsdChange(e.target.value)}
            className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            wBTC Amount
          </label>
          <Input
            type="number"
            placeholder="Enter wBTC amount"
            value={wbtcAmount}
            onChange={(e) => handleWbtcChange(e.target.value)}
            className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow"
          />
        </div>

        <Button
          className="w-full bg-button-primary text-button-primary-text rounded-button shadow-none hover:bg-button-primary-hover disabled:bg-button-primary-disabled-bg disabled:text-button-primary-disabled-text focus:border-button-primary-focus-border focus:shadow-button-primary-focus-shadow"
          disabled={!isConnected || !usdAmount || !wbtcAmount}
        >
          {isConnected ? 'Convert to wBTC' : 'Connect Wallet to Convert'}
        </Button>

        <p className="text-sm text-card-content-secondary text-center">
          Current BTC Price: ${btcPrice.toLocaleString()}
        </p>
      </div>
    </Card>
  );
} 