"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skills_1 = __importDefault(require("./routes/v1/skills"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'SkillHub API' });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.get('/skill.md', (req, res) => {
    const filePath = path_1.default.join(__dirname, 'skill.md');
    if (fs_1.default.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/markdown');
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('Skill description not found');
    }
});
app.use('/v1/skills', skills_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
