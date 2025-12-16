# 🔐 Google OAuth - Guia Completo Passo a Passo

**IMPORTANTE:** Execute cada passo e me confirme antes de continuar.

---

## 📍 PASSO 1: Acessar Google Cloud Console

1. Abra: https://console.cloud.google.com/
2. Faça login com sua conta Google

**✋ PARE AQUI - Me confirme quando estiver logado**

---

## 📍 PASSO 2: Criar/Selecionar Projeto

**Opção A - Se NÃO tem projeto:**

1. Clique em "Select a project" no topo
2. Clique em "NEW PROJECT"
3. Nome do projeto: `Monsan`
4. Clique em "CREATE"
5. Aguarde criar (leva ~30 segundos)
6. Selecione o projeto criado

**Opção B - Se JÁ tem projeto:**

1. Clique em "Select a project" no topo
2. Selecione seu projeto existente

**✋ PARE AQUI - Me diga qual opção escolheu e confirme que o projeto está selecionado**

---

## 📍 PASSO 3: Configurar Tela de Consentimento OAuth

**ANTES de criar credenciais, você PRECISA configurar a tela de consentimento:**

1. No menu lateral (☰), vá em: **APIs & Services** → **OAuth consent screen**

2. **Escolha o tipo de usuário:**
   - ✅ **External** (escolha esta)
   - Clique em "CREATE"

3. **Preencha o formulário:**

   **App information:**
   - App name: `Monsan`
   - User support email: `seu-email@gmail.com` (seu email)

   **App domain (OPCIONAL - pode pular):**
   - Deixe em branco por enquanto

   **Developer contact information:**
   - Email addresses: `seu-email@gmail.com` (seu email)

4. Clique em **"SAVE AND CONTINUE"**

5. **Scopes (Escopos):**
   - Clique em **"ADD OR REMOVE SCOPES"**
   - Marque:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
     - ✅ `openid`
   - Clique em "UPDATE"
   - Clique em **"SAVE AND CONTINUE"**

6. **Test users (Usuários de teste):**
   - Clique em **"ADD USERS"**
   - Adicione seu email: `seu-email@gmail.com`
   - Clique em "ADD"
   - Clique em **"SAVE AND CONTINUE"**

7. **Summary:**
   - Revise e clique em **"BACK TO DASHBOARD"**

**✋ PARE AQUI - Me confirme que configurou a tela de consentimento**

---

## 📍 PASSO 4: Criar Credenciais OAuth

1. No menu lateral, vá em: **APIs & Services** → **Credentials**

2. Clique no botão **"+ CREATE CREDENTIALS"** (no topo)

3. Selecione: **"OAuth client ID"**

4. **Preencha:**

   **Application type:**
   - Selecione: **Web application**

   **Name:**
   - Digite: `Monsan Web Client`

5. **Authorized JavaScript origins:**

   Clique em **"+ ADD URI"** e adicione:

   ```
   http://localhost:5173
   ```

   **Se você já tem domínio DuckDNS**, adicione também (clique em "+ ADD URI" novamente):

   ```
   https://seu-dominio.duckdns.org
   ```

   **Se vai hospedar no Coolify**, adicione também:

   ```
   https://seu-dominio-coolify.com
   ```

6. **Authorized redirect URIs:**

   **ATENÇÃO:** Esta é a parte MAIS IMPORTANTE!

   Você precisa da URL do seu projeto Supabase.

   **Como achar:**
   - Abra outra aba
   - Acesse: https://supabase.com
   - Vá no seu projeto
   - Menu lateral: **Settings** → **API**
   - Copie a **Project URL** (ex: `https://mprzmaolkqjhqwgoqejp.supabase.co`)

   Agora volte ao Google Cloud Console:

   Clique em **"+ ADD URI"** e adicione:

   ```
   https://SEU_PROJETO.supabase.co/auth/v1/callback
   ```

   **Substitua `SEU_PROJETO` pela referência do seu projeto!**

   Exemplo: Se sua URL é `https://mprzmaolkqjhqwgoqejp.supabase.co`
   Então adicione: `https://mprzmaolkqjhqwgoqejp.supabase.co/auth/v1/callback`

7. Clique em **"CREATE"**

8. **Popup aparecerá com:**
   - **Client ID** (algo como: `123456-abc.apps.googleusercontent.com`)
   - **Client secret** (algo como: `GOCSPX-abc123xyz`)

   **COPIE AMBOS** e guarde em algum lugar temporariamente.

**✋ PARE AQUI - Me confirme que copiou Client ID e Client Secret**

---

## 📍 PASSO 5: Configurar no Supabase

1. Abra: https://supabase.com
2. Vá no seu projeto
3. Menu lateral: **Authentication** → **Providers**
4. Role até encontrar **"Google"**
5. Clique para expandir
6. **Configure:**
   - ✅ Marque **"Google enabled"**
   - **Client ID (for OAuth):** Cole o Client ID que você copiou
   - **Client Secret (for OAuth):** Cole o Client Secret que você copiou
7. Clique em **"Save"**

**✋ PARE AQUI - Me confirme que salvou no Supabase**

---

## 📍 PASSO 6: Configurar URLs no Supabase

1. Ainda no Supabase, vá em: **Authentication** → **URL Configuration**

2. **Site URL:**

   ```
   http://localhost:5173
   ```

3. **Redirect URLs:**

   Clique em **"Add URL"** e adicione:

   ```
   http://localhost:5173/auth/callback
   ```

   Clique em **"Add URL"** novamente:

   ```
   http://localhost:5173/**
   ```

   **Se tem DuckDNS**, adicione também:

   ```
   https://seu-dominio.duckdns.org/auth/callback
   https://seu-dominio.duckdns.org/**
   ```

4. Clique em **"Save"**

**✋ PARE AQUI - Me confirme que salvou as URLs**

---

## 📍 PASSO 7: Testar

1. Certifique-se que o servidor está rodando:

   ```bash
   bun run dev --host
   ```

2. Acesse: http://localhost:5173/login

3. Clique em **"Entrar com Google"**

4. **O que deve acontecer:**
   - Abre popup/nova aba do Google
   - Pede para escolher conta Google
   - Mostra tela de consentimento (primeira vez)
   - Redireciona de volta para seu app
   - Você está logado no dashboard

**✋ Me diga o que aconteceu - funcionou ou deu erro?**

---

## 🐛 Se Der Erro

### Erro: "redirect_uri_mismatch"

**Causa:** URL de redirect no Google Cloud não está correta

**Solução:**

1. Volte no Google Cloud Console
2. Credentials → Clique no seu OAuth client
3. Verifique se tem EXATAMENTE:
   ```
   https://SEU_PROJETO.supabase.co/auth/v1/callback
   ```
4. Salve e teste novamente

### Erro: "Access blocked: This app's request is invalid"

**Causa:** Tela de consentimento não configurada ou incompleta

**Solução:**

1. Volte em OAuth consent screen
2. Certifique-se que está "External"
3. Adicione seu email em "Test users"

### Erro: "provider is not enabled"

**Causa:** Google não está habilitado no Supabase

**Solução:**

1. Volte no Supabase
2. Authentication → Providers → Google
3. Certifique-se que está ✅ marcado
4. Aguarde 1-2 minutos

---

## ✅ Checklist Final

Antes de testar, confirme:

- [ ] Projeto criado no Google Cloud
- [ ] Tela de consentimento configurada (External)
- [ ] Seu email adicionado em Test users
- [ ] OAuth Client ID criado
- [ ] JavaScript origins configuradas
- [ ] Redirect URI do Supabase adicionada
- [ ] Client ID e Secret copiados
- [ ] Google habilitado no Supabase
- [ ] Client ID e Secret colados no Supabase
- [ ] URLs configuradas no Supabase
- [ ] Servidor rodando

---

**AGORA EXECUTE PASSO A PASSO E ME CONFIRME CADA UM!**
