import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '../src/lib/server/db/schema';
import { hashPassword } from '../src/lib/server/auth/hashing';
import { like } from 'drizzle-orm';

async function createTestUsers() {
  console.log('Creating test users...');

  // Conectar diretamente ao banco
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  const hashedPassword = await hashPassword('correctpassword');

  // Delete existing test users
  await db.delete(user).where(like(user.email, '%@example.com'));

  // Create test users
  await db.insert(user).values([
    {
      fullName: 'Verified User',
      email: 'verified@example.com',
      passwordHash: hashedPassword,
      isVerified: true,
      role: 'user',
      twoFactorEnabled: false
    },
    {
      fullName: 'Unverified User',
      email: 'unverified@example.com',
      passwordHash: hashedPassword,
      isVerified: false,
      role: 'user',
      twoFactorEnabled: false
    },
    {
      fullName: 'Existing User',
      email: 'existing@example.com',
      passwordHash: hashedPassword,
      isVerified: true,
      role: 'user',
      twoFactorEnabled: false
    }
  ]);

  console.log('✅ Test users created successfully!');
  console.log('- verified@example.com (password: correctpassword)');
  console.log('- unverified@example.com (password: correctpassword)');
  console.log('- existing@example.com (password: correctpassword)');

  await client.end();
  process.exit(0);
}

createTestUsers().catch((error) => {
  console.error('❌ Error creating test users:', error);
  process.exit(1);
});
