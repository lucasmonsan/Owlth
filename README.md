# Owlth

Aplicação web moderna construída com SvelteKit 5, TypeScript e PostgreSQL.

## 🚀 Tecnologias

- **Framework**: SvelteKit 5 (Svelte Runes)
- **Linguagem**: TypeScript (strict mode)
- **Banco de Dados**: PostgreSQL + Drizzle ORM
- **Autenticação**: Session-based com Argon2
- **i18n**: Paraglide (EN + PT-BR)
- **Estilização**: CSS Modules + Design System
- **Testes**: Vitest + Playwright
- **Deploy**: Node adapter (Coolify/VPS)

## ✨ Funcionalidades

- ✅ Autenticação segura com sessões
- ✅ Verificação de email
- ✅ Rate limiting (login + email)
- ✅ Internacionalização (EN/PT-BR)
- ✅ SEO otimizado (meta tags + sitemap)
- ✅ Proteção CSRF automática
- ✅ Verificação de senhas vazadas (HIBP)
- ✅ Proteção HPP (HTTP Parameter Pollution)
- ✅ PWA-ready (manifest + favicons)

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
bun install

# Rodar dev server
bun run dev

# Build para produção
bun run build

# Preview da build
bun run preview
```

## 🗄️ Banco de Dados

```bash
# Gerar migration
bun run db:generate

# Aplicar migration
bun run db:push

# Abrir Drizzle Studio
bun run db:studio
```

## 🔒 Segurança

- Argon2 para hashing de senhas
- Session tokens com SHA-256
- Rate limiting em login e emails
- CSRF protection habilitado
- HPP protection
- Verificação HIBP de senhas vazadas
- Email verification obrigatória

## 🌍 i18n

Suporta EN e PT-BR com detecção automática de idioma do browser.

Rotas:

- `/` - Inglês (padrão)
- `/pt-br/` - Português

## 📦 Scripts Disponíveis

- `dev` - Dev server + tunnel + db studio + paraglide watch
- `build` - Build para produção
- `preview` - Preview da build
- `test` - Rodar testes
- `lint` - ESLint
- `format` - Prettier

## 🚀 Deploy

O projeto usa `@sveltejs/adapter-node` e está pronto para deploy em:

- Coolify
- VPS com Node.js
- Qualquer plataforma que suporte Node

## 📄 Licença

Ver arquivo [LICENSE](LICENSE)

## 🔐 Segurança

Para reportar vulnerabilidades, veja [/.well-known/security.txt](static/.well-known/security.txt)
