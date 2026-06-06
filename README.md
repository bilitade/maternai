# MaternaAI Ethiopia

AI-powered maternal continuity-of-care platform for Ethiopian mothers and Health Extension Workers (HEWs).

## Quick start

```bash
pnpm install
cp .env.example .env.local   # add your OPENROUTER_API_KEY
pnpm test                    # unit tests
pnpm db:push                 # sync schema to Neon
pnpm db:seed                 # demo mother + HEW accounts
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Neon Postgres · Auth.js · OpenRouter · Recharts

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/README.md](docs/README.md) | Feature status tracker |
| [docs/prompt.md](docs/prompt.md) | Implementation reference |
| [docs/workflow.md](docs/workflow.md) | Mermaid workflow diagrams |
| [docs/TEST_CASES.md](docs/TEST_CASES.md) | Manual + automated test checklist |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon Postgres connection string (`?sslmode=require`) |
| `AUTH_SECRET` | Yes | Auth.js secret (`openssl rand -base64 32`) |
| `OPENROUTER_API_KEY` | Optional* | OpenRouter API key for live AI |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL (e.g. `https://your-app.vercel.app`) |

\*Without a valid key, the app uses protocol-based fallback responses so demos still work.

## Deploy (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Set environment variables (Production + Preview):

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | Your Neon connection string |
   | `AUTH_SECRET` | Same secret as local (or generate new) |
   | `OPENROUTER_API_KEY` | Your OpenRouter key |
   | `NEXT_PUBLIC_APP_URL` | `https://<your-vercel-domain>` |

3. Deploy, then run **`pnpm db:seed`** locally (or Neon SQL console with `drizzle/0001_seed_demo_accounts.sql`) so demo logins work in production.

```bash
pnpm build
pnpm test:demo   # optional — against localhost after db:seed
```

## Demo checklist

1. Splash → role select (try EN / አማ toggle)
2. Mother registration → high-risk badge
3. ANC tracker → missed contact escalation
4. Danger signs → AI / fallback preeclampsia warning
5. Nutrition → Get My Tip
6. Wellness check → low score + helpline
7. HEW dashboard → priority list
8. HEW detail → Escalate to health center
