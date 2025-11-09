"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import MenuItemCard from '@/components/canteen/MenuItemCard';
import CartDrawer from '@/components/canteen/CartDrawer';
import RFCCardInput from '@/components/canteen/RFCCardInput';
import OrderReceipt from '@/components/canteen/OrderReceipt';
import { useCartStore } from '@/lib/stores/cartStore';

interface MenuItem {
  id: number;
  itemId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string | null;
  available: boolean;
}

interface Student {
  id: number;
  cardId: string;
  studentId: string;
  studentName: string;
  balance: number;
}

const categories = ['All', 'breakfast', 'lunch', 'dinner', 'beverage', 'snacks'];

const categoryIcons: Record<string, string> = {
  All: '🍽️',
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  beverage: '☕',
  snacks: '🍿'
};

export default function CanteenPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCardInputOpen, setIsCardInputOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [receipt, setReceipt] = useState<any>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const cardId = useCartStore((state) => state.cardId);
  const setCardId = useCartStore((state) => state.setCardId);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch student details when cardId changes
  useEffect(() => {
    if (cardId) {
      fetchStudentDetails(cardId);
    } else {
      setStudent(null);
    }
  }, [cardId]);

  const fetchMenuItems = async () => {
    setIsLoadingMenu(true);
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu items');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const fetchStudentDetails = async (cardId: string) => {
    setIsLoadingStudent(true);
    try {
      const response = await fetch(`/api/students/${cardId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('RFC Card not found. Please check your card ID.');
          setCardId('');
          return;
        }
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      setStudent(data);
      toast.success(`Welcome ${data.studentName}! Balance: ₹${data.balance.toFixed(2)}`);
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Failed to load student details');
      setCardId('');
    } finally {
      setIsLoadingStudent(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cardId) {
      toast.error('Please scan your RFC card first');
      setIsCardInputOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessingOrder(true);
    try {
      const orderPayload = {
        cardId,
        items: cartItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'INSUFFICIENT_BALANCE') {
          toast.error(data.error);
        } else {
          toast.error(data.error || 'Failed to place order');
        }
        return;
      }

      // Order successful
      setReceipt(data);
      setIsReceiptOpen(true);
      setIsCartOpen(false);
      clearCart();
      
      // Update student balance
      if (student) {
        setStudent({
          ...student,
          balance: data.remainingBalance
        });
      }

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-orange-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  College Canteen
                </h1>
                <p className="text-sm text-gray-600">Campus Block A</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Student Balance */}
              {student ? (
                <div className="hidden sm:flex flex-col items-end bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200">
                  <span className="text-xs text-gray-600">{student.studentName}</span>
                  <span className="text-lg font-bold text-green-600">
                    {isLoadingStudent ? '...' : `₹${student.balance.toFixed(2)}`}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => setIsCardInputOpen(true)}
                  variant="outline"
                  className="hidden sm:flex items-center gap-2 border-orange-300 hover:bg-orange-50"
                >
                  <CreditCard className="w-4 h-4" />
                  Scan RFC Card
                </Button>
              )}

              {/* Cart Button */}
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Balance/Card */}
          {student ? (
            <div className="sm:hidden mt-3 flex items-center justify-between bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-200">
              <span className="text-sm text-gray-600">{student.studentName}</span>
              <span className="text-lg font-bold text-green-600">
                {isLoadingStudent ? '...' : `₹${student.balance.toFixed(2)}`}
              </span>
            </div>
          ) : (
            <Button
              onClick={() => setIsCardInputOpen(true)}
              variant="outline"
              className="sm:hidden mt-3 w-full border-orange-300 hover:bg-orange-50"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Scan RFC Card
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-12 shadow-xl">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            Order Your Favorite Food
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Quick, Easy, and Delicious Meals with RFC Card Payment
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-[88px] sm:top-[80px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                    : "border-gray-300 hover:bg-orange-50"
                }`}
              >
                <span className="mr-2">{categoryIcons[category]}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoadingMenu ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Summary (Mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50">
          <Button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl py-6 text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({totalItems} items) • ₹{totalPrice.toFixed(2)}
          </Button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        isProcessing={isProcessingOrder}
      />

      {/* RFC Card Input Modal */}
      <RFCCardInput
        isOpen={isCardInputOpen}
        onClose={() => setIsCardInputOpen(false)}
      />

      {/* Order Receipt Modal */}
      <OrderReceipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receipt={receipt}
      />
    </div>
  );
}
