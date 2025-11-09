import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students, menuItems, orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface OrderItem {
  itemId: string;
  quantity: number;
}

interface OrderRequest {
  cardId: string;
  items: OrderItem[];
}

interface MenuItemWithDetails {
  id: number;
  itemId: string;
  name: string;
  price: number;
  available: boolean;
}

interface ProcessedOrderItem {
  menuItem: MenuItemWithDetails;
  quantity: number;
  subtotal: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: OrderRequest = await request.json();
    const { cardId, items } = body;

    // Validation: Check cardId
    if (!cardId || typeof cardId !== 'string' || cardId.trim() === '') {
      return NextResponse.json(
        { error: 'Card ID is required', code: 'MISSING_CARD_ID' },
        { status: 400 }
      );
    }

    // Validation: Check items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item', code: 'EMPTY_ORDER' },
        { status: 400 }
      );
    }

    // Fetch student by cardId
    const studentResults = await db
      .select()
      .from(students)
      .where(eq(students.cardId, cardId.trim()))
      .limit(1);

    if (studentResults.length === 0) {
      return NextResponse.json(
        { error: 'Student not found', code: 'STUDENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const student = studentResults[0];
    console.log(`Processing order for student: ${student.studentName} (Card ID: ${cardId})`);

    // Process and validate each item
    const processedItems: ProcessedOrderItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      // Validate quantity
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          {
            error: `Invalid quantity for item ${item.itemId}`,
            code: 'INVALID_QUANTITY'
          },
          { status: 400 }
        );
      }

      // Fetch menu item by itemId
      const menuItemResults = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.itemId, item.itemId))
        .limit(1);

      if (menuItemResults.length === 0) {
        return NextResponse.json(
          {
            error: `Menu item ${item.itemId} not found`,
            code: 'MENU_ITEM_NOT_FOUND'
          },
          { status: 400 }
        );
      }

      const menuItem = menuItemResults[0];

      // Check if menu item is available
      if (!menuItem.available) {
        return NextResponse.json(
          {
            error: `Menu item ${menuItem.name} is not available`,
            code: 'MENU_ITEM_UNAVAILABLE'
          },
          { status: 400 }
        );
      }

      // Calculate subtotal
      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        menuItem: {
          id: menuItem.id,
          itemId: menuItem.itemId,
          name: menuItem.name,
          price: menuItem.price,
          available: menuItem.available
        },
        quantity: item.quantity,
        subtotal
      });
    }

    console.log(`Order total: ₹${totalAmount.toFixed(2)}, Student balance: ₹${student.balance.toFixed(2)}`);

    // Check if student has sufficient balance
    if (student.balance < totalAmount) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Please add funds to your RFC card. Current balance: ₹${student.balance.toFixed(2)}, Required: ₹${totalAmount.toFixed(2)}`,
          code: 'INSUFFICIENT_BALANCE',
          currentBalance: student.balance,
          requiredAmount: totalAmount
        },
        { status: 400 }
      );
    }

    // Generate unique order number: ORD-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomDigits}`;

    const currentTimestamp = now.toISOString();

    // Create order
    const newOrderResults = await db
      .insert(orders)
      .values({
        studentId: student.id,
        orderNumber,
        totalAmount,
        status: 'confirmed',
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      })
      .returning();

    const newOrder = newOrderResults[0];
    console.log(`Order created: ${orderNumber} (ID: ${newOrder.id})`);

    // Create order items
    const orderItemsToInsert = processedItems.map(item => ({
      orderId: newOrder.id,
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      priceAtOrder: item.menuItem.price,
      createdAt: currentTimestamp
    }));

    await db.insert(orderItems).values(orderItemsToInsert);
    console.log(`Created ${orderItemsToInsert.length} order items`);

    // Calculate new balance
    const previousBalance = student.balance;
    const remainingBalance = previousBalance - totalAmount;

    // Update student balance and timestamp
    await db
      .update(students)
      .set({
        balance: remainingBalance,
        updatedAt: currentTimestamp
      })
      .where(eq(students.id, student.id));

    console.log(`Student balance updated: ₹${previousBalance.toFixed(2)} → ₹${remainingBalance.toFixed(2)}`);

    // Prepare response
    const responseItems = processedItems.map(item => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.menuItem.price,
      subtotal: item.subtotal
    }));

    const response = {
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      studentName: student.studentName,
      cardId: student.cardId,
      items: responseItems,
      totalAmount,
      previousBalance,
      remainingBalance,
      status: newOrder.status,
      createdAt: newOrder.createdAt
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}