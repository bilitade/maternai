# MaternaAI — Submission Test Cases

Run automated tests: `pnpm test`  
Manual demo script for hackathon judges.

---

## 0. Setup

| Step | Action | Expected |
|------|--------|----------|
| 0.1 | `pnpm install && pnpm dev` | App at http://localhost:3000 |
| 0.2 | `.env.local` has `DATABASE_URL`, `AUTH_SECRET`, `OPENROUTER_API_KEY` | Build and AI work |
| 0.3 | Toggle **EN / አማ** on splash | Nav and mother pages switch language |

---

## 1. Authentication

| ID | Steps | Expected |
|----|-------|----------|
| AUTH-1 | Sign up as **Mother** | Account created, redirected to registration |
| AUTH-2 | Sign up as **HEW** | Lands on HEW dashboard |
| AUTH-3 | Sign out and sign in again | Session restored, correct home route |
| AUTH-4 | Wrong password | Localized error message |

---

## 2. Mother registration (simplified, 3 steps)

| ID | Steps | Expected |
|----|-------|----------|
| REG-1 | Complete step 1: name, age, phone | Continue enabled |
| REG-2 | Complete step 2: region + kebele | No medical jargon fields |
| REG-3 | Step 3: LMP, pregnancy counts, support, meals | Week + due date shown |
| REG-4 | Finish setup | Redirect to dashboard; risk badge visible |
| REG-5 | High-risk profile (age 38 + previous CS) | **High risk** badge on dashboard |

**Note:** HIV, TB, hemoglobin, MUAC are **not** asked of mothers — those belong on HEW/clinical side.

---

## 3. Navigation (no full reload)

| ID | Steps | Expected |
|----|-------|----------|
| NAV-1 | Dashboard → Clinic Visits → Food → back | Sidebar/header stay mounted |
| NAV-2 | Switch language mid-session | Labels update without losing tab |

---

## 4. Clinic visits (ANC)

| ID | Steps | Expected |
|----|-------|----------|
| ANC-1 | Open Clinic Visits | 8 visits listed in plain language |
| ANC-2 | Tap **I went to this visit** | Saved without full-page spinner |
| ANC-3 | LMP set so visit 1 overdue | Overdue badge + follow-up note |

---

## 5. Warning signs + AI

| ID | Steps | Expected |
|----|-------|----------|
| DNG-1 | Select **Bleeding** → Get advice | Loading only in advice panel (Suspense) |
| DNG-2 | Response appears | Page does **not** remount; selections stay |
| DNG-3 | Amharic locale | AI responds in Amharic (if API key set) |
| DNG-4 | Remove API key / offline | Protocol fallback still shows guidance |
| DNG-5 | Dashboard | Urgent flag card if bleeding selected |

---

## 6. Food & nutrition (mother-simple)

| ID | Steps | Expected |
|----|-------|----------|
| NUT-1 | **What I ate** tab | Food group chips only (no MUAC/Hb/iron %) |
| NUT-2 | Save food list | Saves without reloading shell |
| NUT-3 | **Meal ideas** tab → Get food tip | Tip loads in panel; tab stays on guide |
| NUT-4 | Refresh tip | New tip; no tab switch |

---

## 7. Weekly check-in + AI

| ID | Steps | Expected |
|----|-------|----------|
| WEL-1 | Answer all 5 emoji questions | Submit enabled |
| WEL-2 | Submit | Score shown; AI message in isolated panel |
| WEL-3 | Low scores (all 😞) | Helpline text shown |
| WEL-4 | Dashboard | Wellness chart updates |

---

## 8. Birth preparation

| ID | Steps | Expected |
|----|-------|----------|
| DEL-1 | Week &lt; 32 | Locked message with weeks remaining |
| DEL-2 | Week ≥ 32 (adjust LMP for demo) | Checklist in local language |

---

## 9. HEW workflow

| ID | Steps | Expected |
|----|-------|----------|
| HEW-1 | Login as HEW after mother registered | Mother appears in priority list |
| HEW-2 | Open mother detail | Flags, ANC timeline, AI reports |
| HEW-3 | Log phone call / trace | Action saved in history |

---

## 10. Automated unit tests

| Suite | Covers |
|-------|--------|
| `ancLogic` | Overdue tiers, highest alert |
| `riskLogic` | High-risk scoring, gestational weeks |
| `nutritionLogic` | Anemia, MUAC, diversity (HEW/backend use) |
| `aiFallbacks` | Offline demo safety |

```bash
pnpm test
pnpm build
```

Both must pass before submission.

---

## Demo accounts (create before judging)

Run once: `pnpm db:seed`

| Role | Email | Password |
|------|-------|----------|
| Mother | `demo.mother@materna.et` | `demo1234` |
| HEW | `hew@materna.et` | `demo1234` |

Or apply SQL manually: `drizzle/0001_seed_demo_accounts.sql`

---

## Submission checklist

- [ ] `pnpm build` passes  
- [ ] `pnpm test` passes  
- [ ] EN + አማ toggled live in demo  
- [ ] AI works OR offline fallback demonstrated honestly  
- [ ] Mother flow has no clinical jargon (MUAC, gravidity labels plain)  
- [ ] No full-page reload after AI responses  
