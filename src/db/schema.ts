import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Students table with RFC card integration
export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  cardId: text('card_id').notNull().unique(),
  studentId: text('student_id').notNull().unique(),
  studentName: text('student_name').notNull(),
  balance: real('balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Menu items table
export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: text('item_id').notNull().unique(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull().references(() => students.id),
  orderNumber: text('order_number').notNull().unique(),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull().default('pending'),
  aiReceipt: text('ai_receipt'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Order items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  menuItemId: integer('menu_item_id').notNull().references(() => menuItems.id),
  quantity: integer('quantity').notNull(),
  priceAtOrder: real('price_at_order').notNull(),
  createdAt: text('created_at').notNull(),
});