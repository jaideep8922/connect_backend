import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to add a new status
export const addStatus = async (req: any, res: any) => {
    try {
        const statuses = [
            { id: 1, status: 1 },
            { id: 2, status: 2 },
            { id: 3, status: 3 },
            { id: 4, status: 4 }
        ];

        // Using upsert to create or update statuses
        const createdStatuses = await Promise.all(
          statuses.map(({ id, status }) =>
            prisma.status.upsert({
              where: { id },
              update: {},
              create: { id, status }
            })
          )
        );
    
        res.json({
          message: 'Statuses added or updated successfully',
          statuses: createdStatuses
        });
    } catch (error) {
        console.error('Error adding or updating statuses:', error);
        res.status(500).json({ error: 'An error occurred while adding or updating statuses' });
    }
};
