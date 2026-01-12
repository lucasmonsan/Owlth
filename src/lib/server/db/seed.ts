import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { app } from './schema';

// Usar process.env diretamente para seed script
const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client);

export async function seedApps() {
  const apps = [
    {
      name: 'Owlth Auth',
      slug: 'auth',
      url: 'https://owlth.monsan.dev.br',
      icon: '🦉',
      color: '#4F46E5',
      description: 'Central de autenticação da suite Monsan',
      order: 0
    }
    // Adicione mais apps aqui conforme desenvolver
  ];

  for (const appData of apps) {
    await db
      .insert(app)
      .values(appData)
      .onConflictDoNothing({ target: app.slug });
  }

  console.log('✅ Apps seeded successfully');
  await client.end();
}

// Executar seed se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedApps()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
