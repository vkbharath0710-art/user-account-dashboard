"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, CreditCard } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';

interface RFCCardInputProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RFCCardInput({ isOpen, onClose }: RFCCardInputProps) {
  const [inputCardId, setInputCardId] = useState('');
  const setCardId = useCartStore((state) => state.setCardId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputCardId.trim()) {
      toast.error('Please enter your RFC Card ID');
      return;
    }

    setCardId(inputCardId.trim());
    setInputCardId('');
    onClose();
  };

  const demoCards = [
    { id: 'RFC123456', name: 'Bharath K', balance: '₹250.00' },
    { id: 'RFC123457', name: 'Priya Sharma', balance: '₹500.00' },
    { id: 'RFC123458', name: 'Rahul Verma', balance: '₹180.00' },
    { id: 'RFC123459', name: 'Ananya Reddy', balance: '₹350.00' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Scan RFC Card</h2>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter RFC Card ID
                </label>
                <Input
                  type="text"
                  value={inputCardId}
                  onChange={(e) => setInputCardId(e.target.value)}
                  placeholder="e.g., RFC123456"
                  className="text-lg"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg"
              >
                Verify Card
              </Button>
            </form>

            {/* Demo Cards */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Demo Cards (Click to use):</p>
              <div className="space-y-2">
                {demoCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setInputCardId(card.id);
                      setTimeout(() => {
                        setCardId(card.id);
                        onClose();
                      }, 100);
                    }}
                    className="w-full p-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-left transition-colors border border-gray-200 hover:border-orange-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{card.id}</p>
                        <p className="text-sm text-gray-600">{card.name}</p>
                      </div>
                      <span className="text-green-600 font-semibold">{card.balance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
