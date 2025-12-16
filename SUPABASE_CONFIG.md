# ⚙️ Configuração do Supabase - URLs Corretas

## 🔴 PROBLEMA: Link de confirmação errado

Você recebeu: `http://localhost:3000/?code=...`  
Deveria ser: `http://localhost:5173/auth/callback?code=...`

## ✅ SOLUÇÃO: Configurar Site URL no Supabase

### Passo a Passo

1. **Acesse o Supabase Dashboard**
   - https://supabase.com
   - Vá no seu projeto

2. **Configurar URLs**
   - No menu lateral, clique em **Authentication**
   - Clique em **URL Configuration**

3. **Configurar Site URL** (Desenvolvimento)
   ```
   Site URL: http://localhost:5173
   ```

4. **Configurar Redirect URLs** (Adicione estas URLs)
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/**
   ```

5. **Salvar** as configurações

### Para Produção

Quando for para produção, adicione também:

```
Site URL: https://seu-dominio.com

Redirect URLs:
https://seu-dominio.com/auth/callback
https://seu-dominio.com/**
```

## 📧 Email Templates

Se quiser personalizar os emails, vá em:
- **Authentication** → **Email Templates**

Você pode customizar:
- Confirmação de cadastro
- Recuperação de senha
- Mudança de email

## 🔄 Depois de Configurar

1. **Limpe os emails antigos** (os links não vão funcionar mais)
2. **Faça um novo cadastro** para testar
3. **O link de confirmação agora será correto**: `http://localhost:5173/auth/callback?code=...`

---

✅ Pronto! Agora os links de confirmação vão funcionar corretamente!

