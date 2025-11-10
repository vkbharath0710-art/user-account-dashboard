import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, menuItems, students } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Get all orders with details
export async function GET(request: NextRequest) {
  try {
    const allOrders = await db
      .select({
        order: orders,
        student: students,
      })
      .from(orders)
      .leftJoin(students, eq(orders.studentId, students.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (orderRecord) => {
        const items = await db
          .select({
            orderItem: orderItems,
            menuItem: menuItems,
          })
          .from(orderItems)
          .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
          .where(eq(orderItems.orderId, orderRecord.order.id));

        return {
          ...orderRecord.order,
          student: orderRecord.student,
          items: items.map((item) => ({
            ...item.orderItem,
            menuItem: item.menuItem,
          })),
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
