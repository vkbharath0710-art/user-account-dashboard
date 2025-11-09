"use client"

import { Button } from '@/components/ui/button';
import { X, CheckCircle2, Receipt } from 'lucide-react';

interface OrderReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: any;
}

export default function OrderReceipt({ isOpen, onClose, receipt }: OrderReceiptProps) {
  if (!isOpen || !receipt) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Order Successful!</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold text-gray-800">{receipt.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-semibold text-gray-800">{receipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card ID:</span>
                  <span className="font-semibold text-gray-800">{receipt.cardId}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Items Ordered:</h4>
              <div className="space-y-2">
                {receipt.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-orange-600">
                      ₹{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Balance */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800">Total Amount:</span>
                <span className="font-bold text-orange-600">₹{receipt.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Previous Balance:</span>
                <span className="text-gray-800">₹{receipt.previousBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800">Remaining Balance:</span>
                <span className="font-bold text-green-600">₹{receipt.remainingBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-center text-green-700 font-medium">
                ✓ Your order has been confirmed and will be prepared shortly!
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
