# MaternaAI — Documentation Index

| Document | Purpose |
|----------|---------|
| [prompt.md](./prompt.md) | Implementation reference — stack, structure, feature map, rules |
| [workflow.md](./workflow.md) | Mermaid diagrams — navigation, data flow, AI, feature logic |
| [proposal.md](./proposal.md) | Hackathon pitch — problem, product, demo script, business case |

## Implementation status

| Feature | Primary files | Status |
|---------|---------------|--------|
| Client view routing | `components/ApplicationRoot.tsx` | Done |
| EN / Amharic toggle | `lib/i18n.ts`, `components/ui/LanguageToggle.tsx` | Done |
| Protocol AI fallbacks (no key) | `lib/aiFallbacks.ts`, `app/api/ai/route.ts` | Done |
| Mother registration (3 steps) | `components/views/MotherOnboardingPage.tsx` | Done |
| Risk stratification | `lib/riskLogic.ts` | Done |
| Mother dashboard | `components/views/MotherDashboard.tsx` | Done |
| ANC tracker + escalation | `components/views/ANCTrackerPage.tsx` | Done |
| Danger signs + AI | `components/views/DangerSignsPage.tsx` | Done |
| Nutrition guide + AI tip | `components/views/NutritionPage.tsx` | Done |
| Wellness check-in + AI | `components/views/WellnessCheckPage.tsx` | Done |
| Delivery prep checklist | `components/views/DeliveryPrepPage.tsx` | Done |
| HEW priority dashboard | `components/views/HEWDashboard.tsx` | Done |
| HEW mother detail | `components/views/HEWMotherDetailPage.tsx` | Done |
| localStorage persistence | `lib/storage.ts` | Done |
| Responsive web layouts | `components/layout/*` | Done |
| Vercel deployment | — | **Manual** — run `pnpm dlx vercel` |
| Live SMS / push notifications | — | **Deferred** |

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional: OPENROUTER_API_KEY
pnpm dev
```
