"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
// POST /v1/skills
router.post('/', async (req, res) => {
    try {
        const { name, description, category, schema, examples, author } = req.body;
        // Basic validation
        if (!name || !description || !schema || !author) {
            return res.status(400).json({
                error: 'Missing required fields: name, description, schema, and author are required.'
            });
        }
        // Check name uniqueness
        const existingSkill = await prisma_1.default.skill.findUnique({
            where: { name }
        });
        if (existingSkill) {
            return res.status(400).json({ error: 'A skill with this name already exists.' });
        }
        // Create skill
        const skill = await prisma_1.default.skill.create({
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
    }
    catch (error) {
        console.error('Error creating skill:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /v1/skills
router.get('/', async (req, res) => {
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
        const where = {};
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
            prisma_1.default.skill.count({ where }),
            prisma_1.default.skill.findMany({
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
    }
    catch (error) {
        console.error('Error fetching skills:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /v1/skills/:id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const skill = await prisma_1.default.skill.findUnique({
            where: { id }
        });
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        return res.json(skill);
    }
    catch (error) {
        console.error('Error fetching skill by ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// PATCH /v1/skills/:id
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, category, schema, examples, author } = req.body;
        // Check if skill exists
        const existingSkill = await prisma_1.default.skill.findUnique({
            where: { id }
        });
        if (!existingSkill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        // Check name uniqueness if name is being changed
        if (name && name !== existingSkill.name) {
            const nameConflict = await prisma_1.default.skill.findUnique({
                where: { name }
            });
            if (nameConflict) {
                return res.status(400).json({ error: 'A skill with this name already exists.' });
            }
        }
        // Update skill
        const skill = await prisma_1.default.skill.update({
            where: { id },
            data: {
                name,
                description,
                category,
                schema,
                examples,
                author
            }
        });
        return res.json(skill);
    }
    catch (error) {
        console.error('Error updating skill:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /v1/skills/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Check if skill exists
        const skill = await prisma_1.default.skill.findUnique({
            where: { id }
        });
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        // Delete skill
        await prisma_1.default.skill.delete({
            where: { id }
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting skill:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
