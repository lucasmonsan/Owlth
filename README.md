# 🔐 Monsan - Authentication Hub

Portal centralizado de autenticação (SSO) e launcher de aplicações, construído com **Svelte 5 (Runes)** e **Supabase**.

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Svelte](https://img.shields.io/badge/Svelte-5.0-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green)

## ✨ Funcionalidades

- 🔐 **Autenticação completa** com email/senha e Google OAuth
- 🎨 **Design Glassmorphism** com deep dark mode
- 🚀 **Animações suaves** com svelte-motion
- 🔒 **Cloudflare Turnstile** para proteção contra bots
- 📱 **100% Responsivo** com mobile-first design
- ⚡ **TypeScript Strict** em todo o projeto
- 🎯 **SSR completo** com SvelteKit
- 🛡️ **Proteção de rotas** server-side

## 🛠️ Stack Tecnológica

- **Frontend**: Svelte 5 (Runes), TailwindCSS v4, svelte-motion
- **Backend**: SvelteKit, Supabase (Auth + Database)
- **Validação**: Zod
- **Segurança**: Cloudflare Turnstile
- **Runtime**: Bun
- **TypeScript**: Strict mode

## 📁 Estrutura do Projeto

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # Componentes base (Button, Input, GlassCard)
│   │   └── toast/           # Sistema de notificações
│   ├── stores/              # Svelte 5 stores
│   ├── types/               # TypeScript types
│   └── utils/               # Funções utilitárias
├── routes/
│   ├── (auth)/
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de cadastro
│   │   └── forgot-password/ # Recuperação de senha
│   ├── dashboard/           # Dashboard protegido
│   └── auth/callback/       # OAuth callback
└── app.css                  # Estilos globais
```

## 🚀 Quick Start

### Pré-requisitos

- [Bun](https://bun.sh) instalado
- Conta no [Supabase](https://supabase.com)
- Conta no [Cloudflare](https://cloudflare.com) (para Turnstile)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/monsan.git
cd monsan

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor de desenvolvimento
bun run dev
```

### Configuração

Consulte os guias de configuração:

- 📝 [SETUP.md](./SETUP.md) - Guia completo de setup
- 🔐 [GOOGLE_OAUTH_SETUP_COMPLETO.md](./GOOGLE_OAUTH_SETUP_COMPLETO.md) - Configuração do Google OAuth
- 🔒 [TURNSTILE_GUIDE.md](./TURNSTILE_GUIDE.md) - Configuração do Turnstile
- ⚙️ [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md) - Configuração do Supabase

## 📦 Scripts Disponíveis

```bash
bun run dev          # Servidor de desenvolvimento
bun run build        # Build para produção
bun run preview      # Preview da build
bun run check        # Type checking
bun run lint         # Verificar código
bun run format       # Formatar código
```

## 🎨 Design System

### Componentes UI

- **GlassCard**: Card com efeito glassmorphism
- **Button**: Botão com 3 variantes (Primary, Ghost, Outline)
- **Input**: Input com label flutuante e validação visual
- **Toast**: Sistema de notificações animadas

### Paleta de Cores

```css
--color-deep-black: #0a0a0a; /* Fundo principal */
--color-accent: #3b82f6; /* Azul de destaque */
--color-glass-white: rgba(255, 255, 255, 0.05); /* Glass effect */
```

## 🔒 Segurança

- ✅ TypeScript Strict Mode
- ✅ Cloudflare Turnstile (proteção contra bots)
- ✅ Validação server-side com Zod
- ✅ Proteção CSRF nativa do SvelteKit
- ✅ Cookies seguros com httpOnly
- ✅ Row Level Security (RLS) no Supabase

## 📊 Status do Projeto

- [x] Autenticação completa
- [x] Dashboard protegido
- [x] Design glassmorphism
- [x] Sistema de toasts
- [x] Recuperação de senha
- [x] Google OAuth
- [x] Mobile responsivo
- [ ] Mais provedores OAuth
- [ ] Perfil de usuário
- [ ] 2FA (futuro)

## 📝 Licença

[GNU GPL v3](./LICENSE)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📧 Contato

Lucas Monsan - [GitHub](https://github.com/lucasmonsan)

---

**Desenvolvido com ❤️ usando Svelte 5 e Supabase**
