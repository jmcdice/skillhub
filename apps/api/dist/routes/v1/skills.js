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
        const { name, description, schema, examples, author } = req.body;
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
// GET /v1/skills (Bonus: helpful for testing)
router.get('/', async (req, res) => {
    try {
        const skills = await prisma_1.default.skill.findMany();
        return res.json(skills);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
