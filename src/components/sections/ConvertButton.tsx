import React from 'react';
import { Button } from '@/components/ui/button';

interface ConvertButtonProps {
  buttonText: string;
  buttonLoading: boolean;
  isButtonDisabled: boolean;
  onClick: () => void;
}

export function ConvertButton({
  buttonText,
  buttonLoading,
  isButtonDisabled,
  onClick,
}: ConvertButtonProps) {
  return (
    <Button
      className="w-full rounded-xl"
      variant="gradient"
      size="default"
      loading={buttonLoading}
      disabled={isButtonDisabled || buttonLoading}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
} 