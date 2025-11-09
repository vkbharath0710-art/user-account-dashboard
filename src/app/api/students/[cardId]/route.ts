import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params;

    // Validate cardId parameter
    if (!cardId || cardId.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Card ID is required',
          code: 'MISSING_CARD_ID'
        },
        { status: 400 }
      );
    }

    // Query student by cardId
    const student = await db
      .select()
      .from(students)
      .where(eq(students.cardId, cardId))
      .limit(1);

    // Check if student exists
    if (student.length === 0) {
      return NextResponse.json(
        { 
          error: 'Student not found',
          code: 'STUDENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Return student data
    return NextResponse.json(student[0], { status: 200 });

  } catch (error) {
    console.error('GET student by cardId error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}