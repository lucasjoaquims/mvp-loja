# Loja MVP

E-commerce profissional com Next.js 14, Supabase, Mercado Pago e NextAuth.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** + **TailwindCSS** + **Framer Motion**
- **Prisma ORM** + **PostgreSQL** (Supabase)
- **NextAuth v5** (Google + Credentials)
- **Mercado Pago SDK v2** (PIX, Cartão, Boleto)
- **Zustand** (carrinho) + **Recharts** (dashboard)

---

## Deploy na Netlify

### Passo 1 — Subir para o GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/loja-mvp.git
git push -u origin main
```

### Passo 2 — Preparar o banco (Supabase)

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **Connect → Transaction pooler** e copie a URL (porta **6543**)
3. Localmente, com `.env` configurado:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Passo 3 — Criar site na Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Conecte o GitHub e selecione o repositório `loja-mvp`
3. As configs de build são lidas automaticamente do `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Antes de publicar, vá em **Site configuration → Environment variables** e adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | URL Supabase Transaction Pooler (porta 6543) |
| `NEXTAUTH_URL` | `https://seu-site.netlify.app` |
| `NEXTAUTH_SECRET` | string aleatória (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | seu Google Client ID |
| `GOOGLE_CLIENT_SECRET` | seu Google Client Secret |
| `MERCADOPAGO_PUBLIC_KEY` | `APP_USR-f123f2c8-...` |
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-7933412573...` |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | `APP_USR-f123f2c8-...` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-site.netlify.app` |

5. Clique em **Deploy site**

### Passo 4 — Google OAuth

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → Credentials → OAuth 2.0 Client**
3. Authorized redirect URIs: `https://seu-site.netlify.app/api/auth/callback/google`

### Passo 5 — Webhook Mercado Pago

1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. **Webhooks → Adicionar**
3. URL: `https://seu-site.netlify.app/api/pagamentos/webhook`
4. Eventos: `pagamentos`

---

## Desenvolvimento local

```bash
npm install
cp .env.example .env
# edite o .env com suas credenciais

npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Acesse: http://localhost:3000  
Admin: http://localhost:3000/admin  
Login admin: `admin@loja.com` / `Admin@123`

---

## Cupons disponíveis (seed)

| Código | Desconto | Mínimo |
|--------|----------|--------|
| `BEMVINDO10` | 10% | R$ 150 |
| `FRETE20` | R$ 20 fixo | R$ 200 |
| `VIP25` | 25% | R$ 500 |

---

## Customização

Para adaptar para outro negócio:
1. `prisma/seed.ts` → altere categorias e produtos
2. `src/components/layout/Navbar.tsx` e `Footer.tsx` → nome da loja
3. `tailwind.config.ts` → cores
4. `src/components/home/HeroSlider.tsx` → banners
