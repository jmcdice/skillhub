"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const router = (0, express_1.Router)();
// GET /v1/categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma_1.default.skill.findMany({
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
            .filter((c) => !!c)
            .sort();
        return res.json({ data: result });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
