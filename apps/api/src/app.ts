import express, { Request, Response } from 'express';
import skillsRouter from './routes/v1/skills';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'SkillHub API' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/skill.md', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'skill.md');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/markdown');
    res.sendFile(filePath);
  } else {
    res.status(404).send('Skill description not found');
  }
});

app.use('/v1/skills', skillsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
