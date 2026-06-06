# MaternaAI Ethiopia — Implementation Reference

Web-first responsive SPA built with Next.js 16. Client-side view routing (no URL routes per feature). See [workflow.md](./workflow.md) for diagrams and [README.md](./README.md) for status tracking.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| AI | OpenRouter → `meta-llama/llama-3.3-70b-instruct:free` |
| Charts | Recharts |
| Icons | lucide-react |
| Storage | `localStorage` (no database) |
| Deploy | Vercel |

---

## Environment

```bash
# .env.local
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
pnpm install
pnpm add recharts lucide-react   # already in package.json
pnpm dev
```

---

## Project structure

```
app/
  layout.tsx              # Root HTML layout + metadata
  page.tsx                  # Renders ApplicationRoot
  api/ai/route.ts           # Only file that reads OPENROUTER_API_KEY

components/
  ApplicationRoot.tsx       # Client root — AppView state + view switching
  layout/
    PageContainer.tsx       # max-w-7xl content wrapper
    WebHeader.tsx           # Full-width page header
    MotherLayout.tsx        # Mother section: header + sidebar + main
    MotherSidebar.tsx       # Desktop sidebar nav (lg+)
    MotherNavBar.tsx        # Compact horizontal nav (below lg)
    HEWLayout.tsx           # HEW section layout
  views/                    # Feature pages (not Next.js routes)
    SplashPage.tsx
    RoleSelectPage.tsx
    MotherOnboardingPage.tsx
    MotherDashboard.tsx
    ANCTrackerPage.tsx
    DangerSignsPage.tsx
    NutritionPage.tsx
    WellnessCheckPage.tsx
    DeliveryPrepPage.tsx
    HEWDashboard.tsx
    HEWMotherDetailPage.tsx
  ui/                       # Presentational components
    RiskBadge.tsx
    ANCContactCard.tsx
    NutritionCard.tsx
    PriorityMotherCard.tsx

lib/
  types.ts                  # AppView, MotherProfile, API types
  i18n.ts                   # EN / Amharic strings
  aiFallbacks.ts            # Demo-safe responses when API key missing
  riskLogic.ts              # Risk scoring + gestational age
  storage.ts                # localStorage helpers (SSR-safe)
  ai.ts                     # Client fetch wrapper → /api/ai
  hewHelpers.ts             # HEW list merge + priority sort
  motherNav.ts              # Mother navigation items
  strings.ts                # Shared copy (+ future i18n)
  cn.ts                     # className helper

data/
  ancContacts.ts            # WHO 8-contact definitions
  ethiopianFoods.ts         # Trimester food catalog
  sampleMothers.ts          # HEW demo mothers
```

---

## View routing

`ApplicationRoot` holds `view: AppView` in React state. There is no per-feature URL routing at MVP.

```tsx
// app/page.tsx
import ApplicationRoot from '@/components/ApplicationRoot';
export default function Home() {
  return <ApplicationRoot />;
}
```

**AppView values:** `splash` · `roleSelect` · `motherOnboarding` · `motherDashboard` · `ancTracker` · `dangerSigns` · `nutrition` · `wellnessCheck` · `deliveryPrep` · `hewDashboard` · `hewMotherDetail`

---

## Layout system (web)

| Component | Role |
|-----------|------|
| `PageContainer` | Responsive padding, `max-w-7xl` (or `max-w-3xl` for forms) |
| `WebHeader` | Full-width emerald header with back link + brand |
| `MotherLayout` | Sidebar (desktop) + horizontal nav (tablet/mobile) + `<main>` |
| `HEWLayout` | HEW pages with switch-role action |

Design tokens: emerald primary, rounded-2xl cards, responsive grids (`sm` / `md` / `lg` / `xl`).

---

## Feature map

### Mother flow

1. **Registration** (`MotherOnboardingPage`) — 3 steps → `calculateRisk()` → `saveProfile()`
2. **Dashboard** (`MotherDashboard`) — risk badge, feature cards, wellness chart
3. **ANC tracker** — status: completed / missed / upcoming / future; escalation panel on missed
4. **Danger signs** — multi-select → `analyzeDangerSigns()` on button click
5. **Nutrition** — trimester tabs, food grid → `getNutritionTip()` on button click
6. **Wellness** — 5-question emoji scale, score 0–100 → `getWellnessMessage()` if 2+ low weeks
7. **Delivery prep** — locked before week 32; checklist persisted to localStorage

### HEW flow

1. **Dashboard** — merges registered mother + `SAMPLE_MOTHERS`, sorted by flag priority
2. **Mother detail** — ANC timeline, flags, log visit / reminder / escalate actions

### AI API (`app/api/ai/route.ts`)

| Action | Trigger | Client helper |
|--------|---------|---------------|
| `dangerSigns` | Check Symptoms | `analyzeDangerSigns()` |
| `nutrition` | Get My Tip | `getNutritionTip()` |
| `wellness` | Low score streak | `getWellnessMessage()` |

---

## localStorage keys

| Key | Content |
|-----|---------|
| `materna_mother_profile` | `MotherProfile` |
| `materna_anc_contacts` | `ANCContact[]` |
| `materna_wellness_history` | `WellnessEntry[]` |
| `materna_delivery_prep` | checked index `number[]` |
| `materna_hew_visits` | `HEWVisit[]` |

All reads/writes go through `lib/storage.ts` with `typeof window` guards.

---

## Coding rules

1. `'use client'` on any file using hooks, events, or localStorage
2. Never expose `OPENROUTER_API_KEY` outside `app/api/ai/route.ts`
3. Import types from `lib/types.ts` only
4. AI calls on user action only — never on mount
5. Always show loading state and error fallback for AI
6. Responsive web first — test at 375px, 768px, and 1280px
7. HEW dashboard always has data — fall back to `SAMPLE_MOTHERS`

---

## Demo checklist (June 14)

1. Splash → role select
2. Mother: age 38, ~28wk LMP, C-section + hypertension → high-risk badge
3. ANC tracker → missed contact → escalation timeline
4. Danger signs: headache + vision + swelling → AI warning
5. Nutrition → Get My Tip
6. Wellness → all low scores → crisis helpline
7. HEW dashboard → Selamawit first (danger sign)
8. HEW detail → Escalate to health center

---

## Deferred (post-MVP)

- Full Amharic translation of every view (core UI + nav done)
- URL-based routing (`/mother/anc`, etc.)
- SMS gateway, push notifications, offline sync
- DHIS2 / clinic integration
