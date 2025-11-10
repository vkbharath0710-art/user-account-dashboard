import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, students, menuItems } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

// GET - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get total orders count
    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);
    const totalOrders = totalOrdersResult[0]?.count || 0;

    // Get total revenue
    const totalRevenueResult = await db
      .select({ total: sql<number>`sum(${orders.totalAmount})` })
      .from(orders);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Get total students
    const totalStudentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(students);
    const totalStudents = totalStudentsResult[0]?.count || 0;

    // Get total menu items
    const totalMenuItemsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(menuItems);
    const totalMenuItems = totalMenuItemsResult[0]?.count || 0;

    // Get pending orders
    const pendingOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, 'pending'));
    const pendingOrders = pendingOrdersResult[0]?.count || 0;

    // Get completed orders
    const completedOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, 'completed'));
    const completedOrders = completedOrdersResult[0]?.count || 0;

    // Get recent orders (last 5)
    const recentOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        totalAmount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
        studentName: students.studentName,
      })
      .from(orders)
      .leftJoin(students, eq(orders.studentId, students.id))
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalStudents,
      totalMenuItems,
      pendingOrders,
      completedOrders,
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
