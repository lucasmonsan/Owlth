import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { app } from './schema';

console.log('Starting seed script...');
const connectionString = process.env.DATABASE_URL || '';
console.log('Database URL exists:', !!connectionString);

if (!connectionString) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

export async function seedApps() {
  console.log('Seeding apps...');
  const apps = [
    {
      name: 'Owlth',
      slug: 'auth',
      url: 'https://owlth.monsan.dev.br',
      icon: 'Logo',
      color: '#4F46E5',
      description: 'Hub de autenticação',
      order: 0
    },
    {
      name: 'Whallet',
      slug: 'finance',
      url: 'https://finance.monsan.dev.br',
      icon: 'BrazilIcon',
      color: '#059669',
      description: 'Carteira pessoal',
      order: 1
    },
    {
      name: 'Project',
      slug: 'tasks',
      url: 'https://tasks.monsan.dev.br',
      icon: 'GoogleIcon',
      color: '#DB2777',
      description: 'Gerenciador de projetos',
      order: 2
    },
    {
      name: 'Mail',
      slug: 'mail',
      url: 'https://mail.monsan.dev.br',
      icon: 'EmailIcon',
      color: '#EA580C',
      description: 'Servidor de email',
      order: 3
    }
  ];

  for (const appData of apps) {
    await db
      .insert(app)
      .values(appData)
      .onConflictDoUpdate({
        target: app.slug,
        set: {
          name: appData.name,
          description: appData.description,
          icon: appData.icon,
          color: appData.color,
          url: appData.url,
          order: appData.order
        }
      });
  }

  console.log('✅ Apps seeded successfully');
  await client.end();
}

// Executar seed
seedApps()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
