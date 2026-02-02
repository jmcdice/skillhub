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
        const page = req.query.page || '1';
        const limit = req.query.limit || '20';
        const category = req.query.category;
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
        const { id } = req.params;
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
exports.default = router;
