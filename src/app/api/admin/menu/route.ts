import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST - Add new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, imageUrl } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const itemId = `ITEM${Date.now()}`;
    const now = new Date().toISOString();

    const newItem = await db.insert(menuItems).values({
      itemId,
      name,
      price: parseFloat(price),
      category,
      description: description || null,
      imageUrl: imageUrl || null,
      available: true,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { error: 'Failed to add menu item' },
      { status: 500 }
    );
  }
}
