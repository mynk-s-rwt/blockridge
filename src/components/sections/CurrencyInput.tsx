import React from 'react';
import { Input } from '@/components/ui/input';
import { GetBalanceReturnType } from 'wagmi/actions';

interface CurrencyInputProps {
  label: string;
  amount: string;
  currencyLogo: string;
  placeholder: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
  isConnected: boolean;
  balanceDisplay: string | null;
  isActiveInput: boolean;
  isUserTriggeredLoading: boolean;
}

function InputSkeleton() {
  return (
    <div
      className="w-full h-11 border border-input-border rounded-[0.75rem] bg-gray-700/60 animate-pulse px-3 flex items-center"
    >
      <div className="h-5 w-1/3 bg-gray-600/60 rounded" />
    </div>
  );
}

export function CurrencyInput({
  label,
  amount,
  currencyLogo,
  placeholder,
  onChange,
  isDisabled,
  isConnected,
  balanceDisplay,
  isActiveInput,
  isUserTriggeredLoading,
}: CurrencyInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-card-content-secondary mb-2">
        {label}
      </label>
      <div className="relative flex items-center min-h-[48px]">
        {((isActiveInput || !isUserTriggeredLoading)) ? (
          <Input
            type="text"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder={placeholder}
            value={amount}
            onChange={(e) => onChange(e.target.value)}
            className="bg-input-bg text-input-text border-input-border rounded-input placeholder-input-placeholder focus:border-input-focus-border focus:shadow-input-focus-shadow pr-12"
            disabled={isDisabled}
          />
        ) : (
          <InputSkeleton />
        )}
        <img
          src={currencyLogo}
          className="absolute right-3 w-6 h-6"
        />
      </div>
      {isConnected && balanceDisplay && (
        <div className="flex items-center justify-end text-xs text-card-content-balance mt-1">
          {balanceDisplay}
        </div>
      )}
    </div>
  );
} 