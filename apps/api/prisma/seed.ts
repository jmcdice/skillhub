import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const skills = [
    {
      name: 'Weather Agent',
      description: 'Provides real-time weather information and forecasts for any location.',
      category: 'Utilities',
      schema: { type: 'object', properties: { location: { type: 'string' } } },
      author: 'Gromit'
    },
    {
      name: 'Calculator',
      description: 'A simple mathematical tool for basic arithmetic operations.',
      category: 'Tools',
      schema: { type: 'object', properties: { expression: { type: 'string' } } },
      author: 'Wallace'
    },
    {
      name: 'Memory Recall',
      description: 'Stores and retrieves personal notes and long-term memories.',
      category: 'Core',
      schema: { type: 'object', properties: { query: { type: 'string' } } },
      author: 'Jojo'
    }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  console.log('Seeded 3 skills');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
