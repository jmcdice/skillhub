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
    const page = req.query.page?.toString() || '1';
    const limit = req.query.limit?.toString() || '20';
    const category = req.query.category?.toString();
    const q = req.query.q?.toString();
    
    const pageNum = parseInt(page, 10);
    const limitNum = Math.min(parseInt(limit, 10), 100);
    
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
    
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({ error: 'Invalid limit' });
    }

    const where: any = {};
    if (category) {
      where.category = { equals: category };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
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

// GET /v1/skills/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const skill = await prisma.skill.findUnique({
      where: { id }
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    return res.json(skill);
  } catch (error) {
    console.error('Error fetching skill by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
