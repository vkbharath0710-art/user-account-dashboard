import { db } from '@/db';
import { students } from '@/db/schema';

async function main() {
    const sampleStudents = [
        {
            cardId: 'RFC123456',
            studentId: '2025CS123',
            studentName: 'Bharath K',
            balance: 250.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            cardId: 'RFC123457',
            studentId: '2025CS124',
            studentName: 'Priya Sharma',
            balance: 500.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            cardId: 'RFC123458',
            studentId: '2025CS125',
            studentName: 'Rahul Verma',
            balance: 180.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            cardId: 'RFC123459',
            studentId: '2025CS126',
            studentName: 'Ananya Reddy',
            balance: 350.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(students).values(sampleStudents);
    
    console.log('✅ Students seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});