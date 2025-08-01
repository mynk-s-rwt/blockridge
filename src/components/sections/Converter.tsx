import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAccount, useBalance } from 'wagmi';
import { TOKENS } from '@/lib/config';
import { usePrice } from '@/lib/hooks/use-price';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useModal } from 'connectkit';
import { useSwitchChain } from 'wagmi';
import { CurrencyInput } from './CurrencyInput';
import { ReverseButton } from './ReverseButton';
import { ConvertButton } from './ConvertButton';
import { TransactionModal } from './TransactionModal';
import { ErrorMessageDisplay } from './ErrorMessageDisplay';
import { truncateDecimals } from '@/lib/utils/number';

const FALLBACK_BTC_PRICE = 107500;
const decimalRegex = /^\d*(\.\d*)?$/;

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

  // Check for insufficient balance
  let hasInsufficientBalance = false;
  if (isConnected && isOnMainnet) {
    if (isUsdToWbtc) {
      // Compare USDC balance with USD input
      const input = parseFloat(usdAmount || '0');
      const balance = usdcBalance ? parseFloat(usdcBalance.formatted) : 0;
      if (usdAmount && input > balance) {
        hasInsufficientBalance = true;
      }
    } else {
      // Compare wBTC balance with wBTC input
      const input = parseFloat(wbtcAmount || '0');
      const balance = wbtcBalance ? parseFloat(wbtcBalance.formatted) : 0;
      if (wbtcAmount && input > balance) {
        hasInsufficientBalance = true;
      }
    }
  }

  // Button state logic
  const isButtonDisabled = useMemo(() => {
    if (!isConnected) {
      return false; // Always enabled for Connect Wallet
    } else if (!isOnMainnet) {
      return isSwitching;
    } else {
      return isLoading || isUserTriggeredLoading || (!usdAmount && !wbtcAmount) || hasInsufficientBalance;
    }
  }, [isConnected, isOnMainnet, isSwitching, isLoading, isUserTriggeredLoading, usdAmount, wbtcAmount, hasInsufficientBalance]);

  const { buttonText, buttonAction, buttonLoading } = useMemo(() => {
    let text = isUsdToWbtc ? 'Convert to wBTC' : 'Convert to USDC';
    let action = () => {};
    let loading = false;

    if (!isConnected) {
      text = 'Connect Wallet';
      action = () => setOpen(true);
    } else if (!isOnMainnet) {
      text = isSwitching ? 'Switching...' : 'Switch Network';
      action = () => switchChain({ chainId: ETHEREUM_MAINNET_ID });
      loading = isSwitching;
    } else if (hasInsufficientBalance) {
      text = 'Insufficient Balance';
      action = () => {};
    } else {
      text = isUsdToWbtc ? 'Convert to wBTC' : 'Convert to USDC';
      action = () => {
        // TODO: implement conversion logic
        setShowTransactionModal(true);
      };
    }
    return { buttonText: text, buttonAction: action, buttonLoading: loading };
  }, [isConnected, isOnMainnet, isSwitching, hasInsufficientBalance, isUsdToWbtc, setOpen, switchChain, setShowTransactionModal, ETHEREUM_MAINNET_ID]);

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

  const handleUsdChange = useCallback((value: string) => {
    if (value === '' || decimalRegex.test(value)) {
      // Truncate to 2 decimals for USD
      const truncated = truncateDecimals(value, 2);
      setUsdAmount(truncated);
      if (truncated === '') {
        setWbtcAmount('');
        setActiveInput(null);
        setIsUserTriggeredLoading(false);
        return;
      }
      setActiveInput('usd');
      setWbtcAmount(''); // Clear output while loading
      setIsUserTriggeredLoading(true);
    }
  }, [decimalRegex, truncateDecimals, setUsdAmount, setWbtcAmount, setActiveInput, setIsUserTriggeredLoading]);

  const handleWbtcChange = useCallback((value: string) => {
    if (value === '' || decimalRegex.test(value)) {
      // Truncate to 8 decimals for wBTC
      const truncated = truncateDecimals(value, 8);
      setWbtcAmount(truncated);
      if (truncated === '') {
        setUsdAmount('');
        setActiveInput(null);
        setIsUserTriggeredLoading(false);
        return;
      }
      setActiveInput('wbtc');
      setUsdAmount(''); // Clear output while loading
      setIsUserTriggeredLoading(true);
    }
  }, [decimalRegex, truncateDecimals, setWbtcAmount, setUsdAmount, setActiveInput, setIsUserTriggeredLoading]);

  // Reverse handler: switch direction, keep values with their currencies
  const handleReverse = useCallback(() => {
    setIsUsdToWbtc((prev) => !prev);
  }, [setIsUsdToWbtc]);

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 bg-card-bg border border-card-border shadow-card rounded-lg">
      <div className="space-y-6">
        {/* Top Field (dynamic) */}
        <CurrencyInput
          label={isUsdToWbtc ? 'USD Amount' : 'wBTC Amount'}
          amount={isUsdToWbtc ? usdAmount : wbtcAmount}
          currencyLogo={isUsdToWbtc ? TOKENS.USDC.logoURI : TOKENS.BTC.logoURI}
          placeholder={isUsdToWbtc ? 'Enter USD amount' : 'Enter wBTC amount'}
          onChange={isUsdToWbtc ? handleUsdChange : handleWbtcChange}
          isDisabled={isLoading || !!error}
          isConnected={isConnected}
          balanceDisplay={isUsdToWbtc
            ? (isUsdcLoading ? 'Loading USDC...' : isUsdcError ? 'Error loading USDC' : usdcBalance ? `USDC: ${parseFloat(usdcBalance.formatted).toFixed(4)}` : null)
            : (isWbtcLoading ? 'Loading wBTC...' : isWbtcError ? 'Error loading wBTC' : wbtcBalance ? `wBTC: ${parseFloat(wbtcBalance.formatted).toFixed(4)}` : null)
          }
          isActiveInput={(isUsdToWbtc && (activeInput === 'usd' || !isUserTriggeredLoading)) || (!isUsdToWbtc && (activeInput === 'wbtc' || !isUserTriggeredLoading))}
          isUserTriggeredLoading={isUserTriggeredLoading}
        />

        {/* Reverse Button */}
        <ReverseButton onClick={handleReverse} />

        {/* Bottom Field (dynamic) */}
        <CurrencyInput
          label={isUsdToWbtc ? 'wBTC Amount' : 'USD Amount'}
          amount={isUsdToWbtc ? wbtcAmount : usdAmount}
          currencyLogo={isUsdToWbtc ? TOKENS.BTC.logoURI : TOKENS.USDC.logoURI}
          placeholder={isUsdToWbtc ? 'Enter wBTC amount' : 'Enter USD amount'}
          onChange={isUsdToWbtc ? handleWbtcChange : handleUsdChange}
          isDisabled={isLoading || !!error}
          isConnected={isConnected}
          balanceDisplay={!isUsdToWbtc
            ? (isUsdcLoading ? 'Loading USDC...' : isUsdcError ? 'Error loading USDC' : usdcBalance ? `USDC: ${parseFloat(usdcBalance.formatted).toFixed(4)}` : null)
            : (isWbtcLoading ? 'Loading wBTC...' : isWbtcError ? 'Error loading wBTC' : wbtcBalance ? `wBTC: ${parseFloat(wbtcBalance.formatted).toFixed(4)}` : null)
          }
          isActiveInput={(!isUsdToWbtc && (activeInput === 'usd' || !isUserTriggeredLoading)) || (isUsdToWbtc && (activeInput === 'wbtc' || !isUserTriggeredLoading))}
          isUserTriggeredLoading={isUserTriggeredLoading}
        />

        {/* Error message below conversion result */}
        <ErrorMessageDisplay
          error={!!error}
          isUsdcError={isUsdcError}
          isWbtcError={isWbtcError}
        />

        <ConvertButton
          buttonText={buttonText}
          buttonLoading={buttonLoading}
          isButtonDisabled={isButtonDisabled}
          onClick={buttonAction}
        />
      </div>

      {/* Transaction Completion Modal */}
      <TransactionModal isOpen={showTransactionModal} onClose={setShowTransactionModal} />
    </Card>
  );
} 