import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccount, useBalance } from 'wagmi';
import { TOKENS } from '@/lib/config';
import { usePrice } from '@/lib/hooks/use-price';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useModal } from 'connectkit';
import { useSwitchChain } from 'wagmi';
import { ArrowUpDown, CheckCircle } from 'lucide-react';

const FALLBACK_BTC_PRICE = 107500;

function InputSkeleton() {
  return (
    <div
      className="w-full h-11 border border-input-border rounded-[0.75rem] bg-gray-700/60 animate-pulse px-3 flex items-center"
    >
      <div className="h-5 w-1/3 bg-gray-600/60 rounded" />
    </div>
  );
}

export function Converter() {
  const { isConnected, chainId, address } = useAccount();
  const { switchChain, chains, isPending: isSwitching } = useSwitchChain();
  const { setOpen } = useModal();
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [wbtcAmount, setWbtcAmount] = useState<string>('');
  const [activeInput, setActiveInput] = useState<'usd' | 'wbtc' | null>(null);
  const [isUsdToWbtc, setIsUsdToWbtc] = useState(true); // true: USD -> wBTC, false: wBTC -> USD
  const [isUserTriggeredLoading, setIsUserTriggeredLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { usdPrice, isLoading, error, errorObj, refetch } = usePrice('bitcoin');

  const debouncedUsdAmount = useDebounce(usdAmount, 300);
  const debouncedWbtcAmount = useDebounce(wbtcAmount, 300);

  // Always use the latest price, fallback only if error
  const currentPrice = error ? FALLBACK_BTC_PRICE : usdPrice;

  // Ethereum Mainnet chainId (from config)
  const ETHEREUM_MAINNET_ID = 1;
  const isOnMainnet = chainId === ETHEREUM_MAINNET_ID;

  // Button state logic
  const isInputValid = !!usdAmount || !!wbtcAmount;
  // Only disable for loading, switching, or invalid input when converting
  let isButtonDisabled = false;
  if (!isConnected) {
    isButtonDisabled = false; // Always enabled for Connect Wallet
  } else if (!isOnMainnet) {
    isButtonDisabled = isSwitching;
  } else {
    isButtonDisabled = isLoading || isUserTriggeredLoading || (!usdAmount && !wbtcAmount);
  }

  let buttonText = isUsdToWbtc ? 'Convert to wBTC' : 'Convert to USDC';
  let buttonAction = () => {};
  let buttonLoading = false;

  if (!isConnected) {
    buttonText = 'Connect Wallet';
    buttonAction = () => setOpen(true);
  } else if (!isOnMainnet) {
    buttonText = isSwitching ? 'Switching...' : 'Switch Network';
    buttonAction = () => switchChain({ chainId: ETHEREUM_MAINNET_ID });
    buttonLoading = isSwitching;
  } else {
    buttonText = isUsdToWbtc ? 'Convert to wBTC' : 'Convert to USDC';
    buttonAction = () => {
      // TODO: implement conversion logic
      setShowTransactionModal(true);
    };
  }

  // Fetch ETH balance
  const { data: ethBalance, isLoading: isEthLoading, isError: isEthError } = useBalance({
    address,
    chainId,
    query: { enabled: !!address },
  });

  // Fetch USDC balance (ERC20)
  const { data: usdcBalance, isLoading: isUsdcLoading, isError: isUsdcError } = useBalance({
    address,
    chainId,
    token: TOKENS.USDC.address as `0x${string}`,
    query: { enabled: !!address },
  });

  // Fetch wBTC balance (ERC20)
  const { data: wbtcBalance, isLoading: isWbtcLoading, isError: isWbtcError } = useBalance({
    address,
    chainId,
    token: TOKENS.BTC.address as `0x${string}`,
    query: { enabled: !!address },
  });

  // Refetch price when debounced input changes
  useEffect(() => {
    if (debouncedUsdAmount || debouncedWbtcAmount) {
      if (activeInput) setIsUserTriggeredLoading(true);
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
      setActiveInput(null);
      setIsUserTriggeredLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error, usdPrice, debouncedUsdAmount, debouncedWbtcAmount]);

  const decimalRegex = /^\d*(\.\d*)?$/;

  const handleUsdChange = (value: string) => {
    if (value === '' || decimalRegex.test(value)) {
      setUsdAmount(value);
      if (value === '') {
        setWbtcAmount('');
        setActiveInput(null);
        setIsUserTriggeredLoading(false);
        return;
      }
      setActiveInput('usd');
      setWbtcAmount(''); // Clear output while loading
      setIsUserTriggeredLoading(true);
    }
  };

  const handleWbtcChange = (value: string) => {
    if (value === '' || decimalRegex.test(value)) {
      setWbtcAmount(value);
      if (value === '') {
        setUsdAmount('');
        setActiveInput(null);
        setIsUserTriggeredLoading(false);
        return;
      }
      setActiveInput('wbtc');
      setUsdAmount(''); // Clear output while loading
      setIsUserTriggeredLoading(true);
    }
  };

  // Reverse handler: switch direction, keep values with their currencies
  const handleReverse = () => {
    setIsUsdToWbtc((prev) => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card-bg border border-card-border shadow-card rounded-lg">
      <div className="space-y-6">
        {/* Top Field (dynamic) */}
        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            {isUsdToWbtc ? 'USD Amount' : 'wBTC Amount'}
          </label>
          <div className="relative flex items-center min-h-[48px]">
            {((isUsdToWbtc && (activeInput === 'usd' || !isUserTriggeredLoading)) || (!isUsdToWbtc && (activeInput === 'wbtc' || !isUserTriggeredLoading))) ? (
              <Input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder={isUsdToWbtc ? 'Enter USD amount' : 'Enter wBTC amount'}
                value={isUsdToWbtc ? usdAmount : wbtcAmount}
                onChange={(e) => isUsdToWbtc ? handleUsdChange(e.target.value) : handleWbtcChange(e.target.value)}
                className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow pr-12"
                disabled={isLoading || !!error}
              />
            ) : (
              <InputSkeleton />
            )}
            <img
              src={isUsdToWbtc ? TOKENS.USDC.logoURI : TOKENS.BTC.logoURI}
              className="absolute right-3 w-6 h-6"
            />
          </div>
          {/* Show balance for this field */}
          {isConnected && (
            <div className="flex items-center justify-end text-xs text-card-content-balance mt-1">
              {isUsdToWbtc
                ? (isUsdcLoading ? 'Loading USDC...' : isUsdcError ? 'Error loading USDC' : usdcBalance ? `USDC: ${parseFloat(usdcBalance.formatted).toFixed(4)}` : null)
                : (isWbtcLoading ? 'Loading wBTC...' : isWbtcError ? 'Error loading wBTC' : wbtcBalance ? `wBTC: ${parseFloat(wbtcBalance.formatted).toFixed(4)}` : null)
              }
            </div>
          )}
        </div>

        {/* Reverse Button */}
        <div className="flex justify-center my-2">
          <button
            type="button"
            aria-label="Reverse currencies"
            onClick={handleReverse}
            className="flex items-center justify-center rounded-full bg-card-bg border border-card-border shadow-card hover:bg-card-hover transition-colors w-10 h-10 cursor-pointer"
          >
            <ArrowUpDown className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Bottom Field (dynamic) */}
        <div>
          <label className="block text-sm font-medium text-card-content-secondary mb-2">
            {isUsdToWbtc ? 'wBTC Amount' : 'USD Amount'}
          </label>
          <div className="relative flex items-center min-h-[48px]">
            {((isUsdToWbtc && (activeInput === 'wbtc' || !isUserTriggeredLoading)) || (!isUsdToWbtc && (activeInput === 'usd' || !isUserTriggeredLoading))) ? (
              <Input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder={isUsdToWbtc ? 'Enter wBTC amount' : 'Enter USD amount'}
                value={isUsdToWbtc ? wbtcAmount : usdAmount}
                onChange={(e) => isUsdToWbtc ? handleWbtcChange(e.target.value) : handleUsdChange(e.target.value)}
                className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow pr-12"
                disabled={isLoading || !!error}
              />
            ) : (
              <InputSkeleton />
            )}
            <img
              src={isUsdToWbtc ? TOKENS.BTC.logoURI : TOKENS.USDC.logoURI}
              className="absolute right-3 w-6 h-6"
            />
          </div>
          {/* Show balance for this field */}
          {isConnected && (
            <div className="flex items-center justify-end text-xs text-card-content-balance mt-1">
              {!isUsdToWbtc
                ? (isUsdcLoading ? 'Loading USDC...' : isUsdcError ? 'Error loading USDC' : usdcBalance ? `USDC: ${parseFloat(usdcBalance.formatted).toFixed(4)}` : null)
                : (isWbtcLoading ? 'Loading wBTC...' : isWbtcError ? 'Error loading wBTC' : wbtcBalance ? `wBTC: ${parseFloat(wbtcBalance.formatted).toFixed(4)}` : null)
              }
            </div>
          )}
        </div>

        <Button
          className="w-full rounded-xl"
          variant="gradient"
          size="default"
          loading={buttonLoading}
          disabled={isButtonDisabled || buttonLoading}
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      </div>

      {/* Transaction Completion Modal */}
      <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
        <DialogContent className="max-w-sm w-full text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-2 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <span className="text-xl font-bold">Transaction Completed</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-gray-600 dark:text-gray-300">
              Your conversion has been successfully completed!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 