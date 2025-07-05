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
    <Card className="w-full max-w-md mx-auto p-6 bg-primary-card">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            USD Amount
          </label>
          <Input
            type="number"
            placeholder="Enter USD amount"
            value={usdAmount}
            onChange={(e) => handleUsdChange(e.target.value)}
            className="bg-primary-cardHover text-text-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            wBTC Amount
          </label>
          <Input
            type="number"
            placeholder="Enter wBTC amount"
            value={wbtcAmount}
            onChange={(e) => handleWbtcChange(e.target.value)}
            className="bg-primary-cardHover text-text-primary"
          />
        </div>

        <Button
          className="w-full"
          disabled={!isConnected || !usdAmount || !wbtcAmount}
        >
          {isConnected ? 'Convert to wBTC' : 'Connect Wallet to Convert'}
        </Button>

        <p className="text-sm text-text-secondary text-center">
          Current BTC Price: ${btcPrice.toLocaleString()}
        </p>
      </div>
    </Card>
  );
} 