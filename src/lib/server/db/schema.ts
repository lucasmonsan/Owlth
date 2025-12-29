import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';

// Tabela de Usuários
export const user = pgTable('user', {
  // UUID v4 gerado automaticamente pelo Banco
  id: uuid('id').primaryKey().defaultRandom(),

  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),

  // Segurança MFA/2FA
  twoFactorSecret: text('two_factor_secret'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  recoveryCode: text('recovery_code'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Tabela de Sessões
export const session = pgTable('session', {
  id: text('id').primaryKey(), // ID da sessão gerado pela aplicação (ex: Oslo)
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),

  // Auditoria
  ipAddress: text('ip_address'),
  userAgent: text('user_agent')
});

// Tokens de Verificação (Email/Senha)
export const token = pgTable('token', {
  hash: text('hash').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'email_verification' | 'password_reset'
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Passkeys (WebAuthn)
export const passkey = pgTable('passkey', {
  id: text('id').primaryKey(), // Credential ID (vem do navegador)
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  backedUp: boolean('backed_up').default(false).notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});