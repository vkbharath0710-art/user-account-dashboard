import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq, like, and, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Start with base query filtering for available items
    let query = db.select().from(menuItems);

    // Build conditions array
    const conditions = [eq(menuItems.available, true)];

    // Add category filter if provided
    if (category) {
      conditions.push(eq(menuItems.category, category));
    }

    // Add search filter if provided
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        and(
          like(menuItems.name, searchPattern),
          like(menuItems.description, searchPattern)
        ) as any
      );
    }

    // Apply all conditions
    if (conditions.length === 1) {
      query = query.where(conditions[0]);
    } else {
      query = query.where(and(...conditions) as any);
    }

    // Sort by category and then by name
    query = query.orderBy(asc(menuItems.category), asc(menuItems.name));

    // Execute query
    const results = await query;

    // Return results (empty array if no items found)
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET menu items error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'DATABASE_ERROR'
      },
      { status: 500 }
    );
  }
}