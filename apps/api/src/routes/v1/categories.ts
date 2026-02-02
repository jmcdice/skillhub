import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

// GET /v1/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.skill.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      where: {
        category: {
          not: null,
        },
      },
    });

    const result = categories
      .map((c) => c.category)
      .filter((c): c is string => !!c)
      .sort();

    return res.json({ data: result });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
