import { pgTable, text, timestamp, boolean, integer, uuid, index } from 'drizzle-orm/pg-core';

export const loginAttempt = pgTable('login_attempt', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  ipAddress: text('ip_address').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastAttemptAt: timestamp('last_attempt_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull()
});

export const emailAttempt = pgTable('email_attempt', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  purpose: text('purpose').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull()
});

export const oauthAccount = pgTable('oauth_account', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'google', 'github', etc
  providerId: text('provider_id').notNull(), // ID do usuário no provider
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
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

export const verificationToken = pgTable('verification_token', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// App Suite Management
export const app = pgTable('app', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  url: text('url').notNull(),
  icon: text('icon'), // Emoji ou URL
  color: text('color').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const userApp = pgTable('user_app', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  appId: uuid('app_id')
    .notNull()
    .references(() => app.id, { onDelete: 'cascade' }),
  lastAccessedAt: timestamp('last_accessed_at')
});

// Login History & Security
export const loginHistory = pgTable('login_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ip: text('ip').notNull(),
  userAgent: text('user_agent'),
  country: text('country'),
  city: text('city'),
  device: text('device'), // 'desktop', 'mobile', 'tablet'
  browser: text('browser'),
  success: boolean('success').notNull(),
  riskLevel: text('risk_level'), // 'low', 'medium', 'high'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Notification Preferences
export const notificationPreference = pgTable('notification_preference', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'security', 'login', 'app_notification'
  email: boolean('email').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

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