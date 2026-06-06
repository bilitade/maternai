# MaternaAI Ethiopia

AI-powered maternal continuity-of-care platform for Ethiopian mothers and Health Extension Workers (HEWs).

## Quick start

```bash
pnpm install
cp .env.example .env.local   # add your OPENROUTER_API_KEY
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · OpenRouter · Recharts · localStorage

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/README.md](docs/README.md) | Feature status tracker |
| [docs/prompt.md](docs/prompt.md) | Implementation reference |
| [docs/workflow.md](docs/workflow.md) | Mermaid workflow diagrams |
| [docs/proposal.md](docs/proposal.md) | Hackathon pitch |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Optional* | OpenRouter API key for live AI |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for OpenRouter referer header |

\*Without a valid key, the app uses protocol-based fallback responses so demos still work.

## Deploy (Vercel)

```bash
pnpm build
pnpm dlx vercel
```

Set `OPENROUTER_API_KEY` and `NEXT_PUBLIC_APP_URL` in the Vercel project settings, then redeploy.

## Demo checklist

1. Splash → role select (try EN / አማ toggle)
2. Mother registration → high-risk badge
3. ANC tracker → missed contact escalation
4. Danger signs → AI / fallback preeclampsia warning
5. Nutrition → Get My Tip
6. Wellness check → low score + helpline
7. HEW dashboard → priority list
8. HEW detail → Escalate to health center
