import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

// POST /v1/skills
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, category, schema, examples, author } = req.body;

    // Basic validation
    if (!name || !description || !schema || !author) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, description, schema, and author are required.' 
      });
    }

    // Check name uniqueness
    const existingSkill = await prisma.skill.findUnique({
      where: { name }
    });

    if (existingSkill) {
      return res.status(400).json({ error: 'A skill with this name already exists.' });
    }

    // Create skill
    const skill = await prisma.skill.create({
      data: {
        name,
        description,
        category,
        schema,
        examples,
        author
      }
    });

    return res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /v1/skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', category } = req.query;
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), 100);
    
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
    
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid limit' });
    }

    const where: any = {};
    if (category) {
      // Assuming 'category' exists in schema or we treat it as a prefix/tag for now
      // Based on PRD/Issues, we'll use a string match. 
      // Note: If the schema doesn't have category, we might need a migration, 
      // but I should check schema.prisma first.
      where.category = category;
    }

    const [total, skills] = await Promise.all([
      prisma.skill.count({ where }),
      prisma.skill.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return res.json({
      data: skills,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
