# Guia de Configuração: HTTP Security Headers

## 📋 O que são HTTP Security Headers?

Headers HTTP que o servidor envia para instruir o navegador sobre políticas de segurança. Exemplos:

- `X-Frame-Options`: Previne clickjacking
- `X-Content-Type-Options`: Previne MIME sniffing
- `Strict-Transport-Security`: Força HTTPS

---

## 🎯 Onde Configurar

Você está usando **Coolify** para deploy. Os headers devem ser configurados no **proxy reverso** (Nginx/Caddy).

---

## ⚙️ Configuração no Coolify

### Opção 1: Via Interface Coolify

1. Acesse seu projeto no Coolify
2. Vá em **Settings** → **Custom Headers**
3. Adicione os headers abaixo

### Opção 2: Via Arquivo de Configuração

Se Coolify usa Caddy (padrão), crie/edite o `Caddyfile`:

```caddy
owlth.monsan.dev.br {
    reverse_proxy localhost:3000

    header {
        # Previne clickjacking
        X-Frame-Options "DENY"

        # Previne MIME sniffing
        X-Content-Type-Options "nosniff"

        # Força HTTPS por 1 ano (31536000 segundos)
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

        # Previne XSS (redundante com CSP, mas boa prática)
        X-XSS-Protection "1; mode=block"

        # Controla informações do Referrer
        Referrer-Policy "strict-origin-when-cross-origin"

        # Permissions Policy (substitui Feature-Policy)
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }
}
```

Se usa Nginx:

```nginx
server {
    listen 443 ssl;
    server_name owlth.monsan.dev.br;

    # Headers de segurança
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Como Testar

Após configurar, teste com:

```bash
curl -I https://owlth.monsan.dev.br
```

Você deve ver os headers na resposta:

```
HTTP/2 200
x-frame-options: DENY
x-content-type-options: nosniff
strict-transport-security: max-age=31536000; includeSubDomains; preload
...
```

Ou use ferramentas online:

- https://securityheaders.com
- https://observatory.mozilla.org

---

## ⚠️ Notas Importantes

### HSTS (Strict-Transport-Security)

**Cuidado**: Uma vez ativado com `preload`, o navegador **sempre** forçará HTTPS, mesmo que você remova o header depois.

**Recomendação**: Comece com `max-age=300` (5 minutos) para testar:

```
Strict-Transport-Security: max-age=300
```

Depois aumente gradualmente:

- 1 dia: `max-age=86400`
- 1 semana: `max-age=604800`
- 1 ano: `max-age=31536000`

### CSP (Content-Security-Policy)

**Já está configurado** no `svelte.config.js`! SvelteKit envia automaticamente via meta tag.

Se quiser enviar via HTTP header também (mais seguro), adicione no proxy:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com; frame-ancestors 'none'
```

---

## 📊 Checklist de Implementação

- [ ] Acessar Coolify
- [ ] Localizar configuração de headers (Settings → Custom Headers ou Caddyfile/Nginx)
- [ ] Adicionar headers básicos (X-Frame-Options, X-Content-Type-Options)
- [ ] Testar com `curl -I`
- [ ] Adicionar HSTS com `max-age=300` (teste)
- [ ] Verificar em https://securityheaders.com
- [ ] Aumentar HSTS para `max-age=31536000` após confirmar que tudo funciona
- [ ] (Opcional) Adicionar CSP via header HTTP

---

## 🆘 Troubleshooting

### "Não encontro onde adicionar headers no Coolify"

Coolify geralmente usa Caddy. Procure por:

- **Custom Configuration** ou **Advanced Settings**
- Arquivo `Caddyfile` no diretório do projeto
- Opção de "Custom Nginx/Caddy Config"

### "Headers não aparecem no curl"

Verifique:

1. Está testando HTTPS (não HTTP)
2. Reiniciou o proxy após alterar config
3. Não há cache do navegador/CDN

### "HSTS quebrou meu site"

Se configurou `max-age` muito alto e precisa reverter:

1. Remova o header do servidor
2. No Chrome: `chrome://net-internals/#hsts` → Delete domain
3. No Firefox: Limpe histórico e cache

---

## ✅ Resultado Esperado

Após configurar, seu site deve ter **nota A** em:

- https://securityheaders.com
- https://observatory.mozilla.org
