# 🚀 Guia de Setup - Jaci Auth Hub

## Pré-requisitos

- Bun instalado (`curl -fsSL https://bun.sh/install | bash`)
- Conta no Supabase (https://supabase.com)
- Conta no Cloudflare para Turnstile (https://cloudflare.com)

## Passo a Passo

### 1. Instalar Dependências

```bash
bun install
```

### 2. Configurar Supabase

1. Acesse https://supabase.com e crie um novo projeto
2. Aguarde a criação do projeto (pode levar alguns minutos)
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** (PUBLIC_SUPABASE_URL)
   - **anon/public key** (PUBLIC_SUPABASE_ANON_KEY)

#### 2.1. Configurar OAuth do Google (Opcional)

1. No Supabase, vá em **Authentication** → **Providers**
2. Ative o **Google**
3. Siga as instruções para criar credenciais OAuth no Google Cloud Console
4. Configure a URL de callback: `http://localhost:5173/auth/callback`

#### 2.2. Criar Tabela de Perfis (Opcional)

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de perfis
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table profiles enable row level security;

-- Políticas de segurança
create policy "Usuários podem ver seu próprio perfil"
  on profiles for select
  using (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
  on profiles for update
  using (auth.uid() = id);

-- Trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Configurar Cloudflare Turnstile

1. Acesse https://dash.cloudflare.com
2. Vá em **Turnstile**
3. Clique em **Add Site**
4. Configure:
   - **Widget name**: `Monsan Auth` (nome interno, pode ser qualquer um)
   - **Hostname**: `localhost` (para desenvolvimento, adicione seu domínio depois)
   - **Widget Mode**: Selecione **"Managed"** (recomendado - Cloudflare decide quando mostrar o desafio)
   - **Pre-clearance**: Deixe **desmarcado** (apenas para uso avançado)
5. Clique em **Create**
6. Copie a **Site Key** (PUBLIC_TURNSTILE_SITE_KEY)

**Explicação dos campos:**
- **Widget name**: Nome interno para você identificar o widget no dashboard
- **Hostname**: Domínio onde o widget será usado (localhost para dev, seu-dominio.com para produção)
- **Widget Mode**: 
  - `Managed` = Cloudflare decide automaticamente quando mostrar desafio (recomendado)
  - `Non-interactive` = Invisível, só mostra se detectar comportamento suspeito
  - `Invisible` = Completamente invisível, valida em background
- **Pre-clearance**: Regras avançadas de quando pular o desafio (deixe desmarcado inicialmente)

### 4. Criar Arquivo .env

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
PUBLIC_TURNSTILE_SITE_KEY=sua_site_key_turnstile_aqui
```

### 5. Iniciar o Servidor

```bash
bun run dev
```

Acesse: http://localhost:5173

## 🎯 Testando o Sistema

### Fluxo de Cadastro

1. Acesse http://localhost:5173
2. Clique em **"Começar Agora"**
3. Preencha o formulário de cadastro
4. Complete o captcha Turnstile
5. Clique em **"Criar Conta"**
6. Você será redirecionado para o dashboard

### Fluxo de Login

1. Acesse http://localhost:5173/login
2. Use as credenciais criadas no cadastro
3. Ou clique em **"Entrar com Google"** (se configurado)
4. Você será redirecionado para o dashboard

### Dashboard

- Visualize os aplicativos disponíveis
- Apps ativos aparecem coloridos e clicáveis
- Apps inativos aparecem em cinza com cadeado
- Use o botão **"Sair"** para fazer logout

## 🐛 Troubleshooting

### Erro: "Invalid API key"

- Verifique se as credenciais do Supabase estão corretas no `.env`
- Certifique-se de que o projeto Supabase está ativo

### Erro: "Turnstile verification failed"

- Verifique se a Site Key do Turnstile está correta
- Certifique-se de que `localhost` está configurado nos domínios permitidos

### Erro: "Session not found"

- Limpe os cookies do navegador
- Verifique se o hook do servidor está configurado corretamente

## 📚 Recursos Adicionais

- [Documentação do SvelteKit](https://kit.svelte.dev)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Turnstile](https://developers.cloudflare.com/turnstile)
- [Svelte 5 Runes](https://svelte-5-preview.vercel.app/docs/runes)

## 🎨 Customização

### Cores do Tema

Edite `src/app.css` para alterar as cores:

```css
@theme {
  --color-deep-black: #0a0a0a;
  --color-accent: #3b82f6;
  --color-glass-white: rgba(255, 255, 255, 0.05);
}
```

### Aplicativos no Dashboard

Edite `src/routes/dashboard/+page.svelte` e modifique o array `apps`:

```typescript
const apps = [
  {
    id: 'seu-app',
    name: 'Seu App',
    description: 'Descrição do seu app',
    icon: IconComponent,
    active: true,
    color: 'from-blue-500 to-cyan-600',
    url: '/apps/seu-app'
  }
];
```

---

✨ Pronto! Seu Jaci Auth Hub está configurado e funcionando!

