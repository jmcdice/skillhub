import express, { Request, Response } from 'express';
import skillsRouter from './routes/v1/skills';

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

app.use('/v1/skills', skillsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
