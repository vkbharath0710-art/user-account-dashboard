"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';

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

interface MenuItemCardProps {
  item: MenuItem;
}

const categoryColors: Record<string, string> = {
  breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  lunch: 'bg-orange-100 text-orange-800 border-orange-300',
  dinner: 'bg-purple-100 text-purple-800 border-purple-300',
  beverage: 'bg-blue-100 text-blue-800 border-blue-300',
  snacks: 'bg-green-100 text-green-800 border-green-300',
};

const foodImages: Record<string, string> = {
  'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
  'Idli Sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
  'Poha': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
  'Upma': 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400',
  'Veg Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  'Dal Rice': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
  'Chole Bhature': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400',
  'Veg Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
  'Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
  'Aloo Paratha': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
  'Rajma Rice': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  'Tea': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400',
  'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
  'Buttermilk': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
  'Lime Soda': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
  'Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
  'Pakora': 'https://images.unsplash.com/photo-1606491956391-e21e2e61ed14?w=400',
  'Vada Pav': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400',
  'Bread Pakora': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const imageUrl = foodImages[item.name] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400';

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <Badge className={`absolute top-3 left-3 ${categoryColors[item.category] || 'bg-gray-100'} border`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">₹{item.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            disabled={!item.available}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
