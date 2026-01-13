import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '../src/lib/server/db/schema';
import { like } from 'drizzle-orm';

async function checkTestUsers() {
  console.log('Checking test users...\n');

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  const testUsers = await db
    .select({
      email: user.email,
      fullName: user.fullName,
      isVerified: user.isVerified,
      hasPassword: user.passwordHash
    })
    .from(user)
    .where(like(user.email, '%@example.com'));

  console.log('Found', testUsers.length, 'test users:\n');
  testUsers.forEach((u) => {
    console.log(`- ${u.email}`);
    console.log(`  Name: ${u.fullName}`);
    console.log(`  Verified: ${u.isVerified}`);
    console.log(`  Has password: ${u.hasPassword ? 'Yes' : 'No'}\n`);
  });

  await client.end();
  process.exit(0);
}

checkTestUsers().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
