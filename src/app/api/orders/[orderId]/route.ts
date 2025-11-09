import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, students, menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    // Validate orderId is a valid positive integer
    if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
      return NextResponse.json(
        { 
          error: 'Valid order ID is required',
          code: 'INVALID_ORDER_ID'
        },
        { status: 400 }
      );
    }

    const orderIdInt = parseInt(orderId);

    // Fetch order by id
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, orderIdInt))
      .limit(1);

    // If order not found
    if (order.length === 0) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const orderData = order[0];

    // Fetch student details for the order
    const student = await db.select()
      .from(students)
      .where(eq(students.id, orderData.studentId))
      .limit(1);

    if (student.length === 0) {
      return NextResponse.json(
        { 
          error: 'Student not found for this order',
          code: 'STUDENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const studentData = student[0];

    // Fetch all order items for this order
    const items = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderIdInt));

    // For each order item, fetch the associated menu item details
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const menuItem = await db.select()
          .from(menuItems)
          .where(eq(menuItems.id, item.menuItemId))
          .limit(1);

        if (menuItem.length === 0) {
          return null;
        }

        const menuItemData = menuItem[0];
        const subtotal = item.quantity * item.priceAtOrder;

        return {
          name: menuItemData.name,
          quantity: item.quantity,
          priceAtOrder: item.priceAtOrder,
          subtotal: subtotal,
          category: menuItemData.category
        };
      })
    );

    // Filter out any null items (in case menu item was deleted)
    const validItems = itemsWithDetails.filter(item => item !== null);

    // Return comprehensive order details with all items
    const response = {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      student: {
        studentId: studentData.studentId,
        studentName: studentData.studentName,
        cardId: studentData.cardId
      },
      items: validItems,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      aiReceipt: orderData.aiReceipt,
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}