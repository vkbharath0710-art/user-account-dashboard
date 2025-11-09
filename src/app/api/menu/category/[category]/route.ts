import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;

    // Validate category parameter
    if (!category) {
      return NextResponse.json(
        { 
          error: 'Category is required',
          code: 'MISSING_CATEGORY' 
        },
        { status: 400 }
      );
    }

    // Convert category to lowercase for case-insensitive matching
    const normalizedCategory = category.toLowerCase().trim();

    // Query menu items by category and availability
    const items = await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.category, normalizedCategory),
          eq(menuItems.available, true)
        )
      )
      .orderBy(asc(menuItems.name));

    // Return empty array if no items found (not an error)
    return NextResponse.json(items, { status: 200 });

  } catch (error) {
    console.error('GET menu items by category error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'DATABASE_ERROR'
      },
      { status: 500 }
    );
  }
}