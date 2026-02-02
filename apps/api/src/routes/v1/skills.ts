import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const router = Router();

// POST /v1/skills
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, schema, examples, author } = req.body;

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

// GET /v1/skills (Bonus: helpful for testing)
router.get('/', async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany();
    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
