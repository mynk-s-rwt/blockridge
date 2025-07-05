import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ReverseButtonProps {
  onClick: () => void;
}

export function ReverseButton({ onClick }: ReverseButtonProps) {
  return (
    <div className="flex justify-center my-2">
      <button
        type="button"
        aria-label="Reverse currencies"
        onClick={onClick}
        className="flex items-center justify-center rounded-full bg-card-bg border border-card-border shadow-card hover:bg-card-hover transition-colors w-10 h-10 cursor-pointer"
      >
        <ArrowUpDown className="w-5 h-5 text-text-primary" />
      </button>
    </div>
  );
} 