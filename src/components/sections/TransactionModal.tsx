import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function TransactionModal({
  isOpen,
  onClose,
}: TransactionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
} 