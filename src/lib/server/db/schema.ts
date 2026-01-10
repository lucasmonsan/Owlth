import { pgTable, text, timestamp, boolean, integer, uuid, index } from 'drizzle-orm/pg-core';

export const loginAttempt = pgTable('login_attempt', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  ipAddress: text('ip_address').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttemptAt: timestamp('last_attempt_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull()
});

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),

  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  profilePicture: text('profile_picture'),

  twoFactorSecret: text('two_factor_secret'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  recoveryCode: text('recovery_code'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),

  ipAddress: text('ip_address'),
  userAgent: text('user_agent')
}, (table) => [
  index('session_user_id_idx').on(table.userId)
]);

export const token = pgTable('token', {
  hash: text('hash').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
}, (table) => [
  index('token_user_id_idx').on(table.userId)
]);

export const passkey = pgTable('passkey', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  backedUp: boolean('backed_up').default(false).notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
  index('passkey_user_id_idx').on(table.userId)
]);