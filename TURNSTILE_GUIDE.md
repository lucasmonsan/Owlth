# 🔒 Guia Cloudflare Turnstile

Guia rápido para configurar o Cloudflare Turnstile no Monsan.

## 📋 Passo a Passo

### 1. Acessar o Dashboard

Vá para: https://dash.cloudflare.com

Se não tiver conta, crie uma (é grátis).

### 2. Criar Widget

1. No menu lateral, clique em **"Turnstile"**
2. Clique no botão **"Add Site"**

### 3. Preencher Formulário

#### Widget name
```
Monsan Auth
```
**O que é?** Nome interno para você identificar no dashboard. Pode ser qualquer nome.

#### Hostname
```
localhost
```
**O que é?** Domínio onde o widget será usado.
- Para desenvolvimento: `localhost`
- Para produção: adicione seu domínio real depois (ex: `monsan.com`)

💡 **Dica**: Você pode adicionar múltiplos hostnames depois.

#### Widget Mode

Selecione: **"Managed"** (recomendado)

**O que é?** Como o Turnstile vai funcionar:

- **Managed** ✅ (Recomendado)
  - Cloudflare decide automaticamente quando mostrar o desafio
  - Melhor experiência para o usuário
  - Mais fácil de configurar

- **Non-Interactive**
  - Invisível por padrão
  - Só mostra desafio se detectar comportamento suspeito
  - Mais avançado

- **Invisible**
  - Completamente invisível
  - Valida em background sem interação
  - Para uso avançado

#### Pre-clearance

**Deixe desmarcado** ❌

**O que é?** Regras avançadas para pular o desafio em casos específicos.
- Só use se souber o que está fazendo
- Para começar, deixe desmarcado

### 4. Criar e Copiar Chave

1. Clique em **"Create"**
2. Você verá duas chaves:
   - **Site Key** - Use esta no frontend (`.env`)
   - **Secret Key** - Use no backend (não usamos neste projeto)
3. Copie a **Site Key**

### 5. Adicionar ao .env

Abra o arquivo `.env` e adicione:

```env
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...sua_chave_aqui
```

### 6. Testar

```bash
bun run dev
```

Acesse: http://localhost:5173/register

O widget Turnstile deve aparecer antes do botão de cadastro.

## 🎯 Configuração para Produção

Quando for para produção:

1. Volte ao dashboard do Turnstile
2. Clique no seu widget
3. Em **"Domains"**, adicione seu domínio real:
   ```
   monsan.com
   www.monsan.com
   ```
4. Salve

O mesmo **Site Key** funcionará tanto em localhost quanto em produção.

## 🐛 Troubleshooting

### Erro: "Invalid site key"
- Verifique se copiou a **Site Key** correta (não a Secret Key)
- Confirme que o valor está no `.env` com o prefixo `PUBLIC_`

### Widget não aparece
- Limpe o cache do navegador
- Verifique o console do navegador para erros
- Confirme que `localhost` está na lista de hostnames

### "Hostname verification failed"
- Adicione `localhost` aos hostnames permitidos
- Espere 1-2 minutos após adicionar (propagação)

## 📚 Recursos

- [Documentação Oficial](https://developers.cloudflare.com/turnstile)
- [Dashboard Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
- [Exemplos de Integração](https://developers.cloudflare.com/turnstile/get-started)

## 💡 Dicas

1. **Widget Mode**: Use "Managed" para começar
2. **Múltiplos Ambientes**: Você pode usar o mesmo Site Key em dev e prod
3. **Analytics**: O dashboard mostra estatísticas de uso
4. **Rate Limiting**: Turnstile tem limites generosos no plano gratuito

---

✅ Pronto! Seu Turnstile está configurado e funcionando!

