# MaternaAI — Application Workflow

Mermaid diagrams for the current web implementation. See [prompt.md](./prompt.md) for file paths and [README.md](./README.md) for feature status.

---

## 1. View navigation (`ApplicationRoot`)

Client-side routing via `AppView` state — no per-feature URL routes at MVP.

```mermaid
flowchart TD
  splash[SplashPage]
  roleSelect[RoleSelectPage]
  motherOnboarding[MotherOnboardingPage]
  motherDashboard[MotherDashboard]
  ancTracker[ANCTrackerPage]
  dangerSigns[DangerSignsPage]
  nutrition[NutritionPage]
  wellnessCheck[WellnessCheckPage]
  deliveryPrep[DeliveryPrepPage]
  hewDashboard[HEWDashboard]
  hewMotherDetail[HEWMotherDetailPage]

  splash -->|"auto 2s"| roleSelect
  roleSelect -->|"Mother"| motherOnboarding
  roleSelect -->|"HEW"| hewDashboard
  motherOnboarding --> motherDashboard

  motherDashboard --> ancTracker
  motherDashboard --> dangerSigns
  motherDashboard --> nutrition
  motherDashboard --> wellnessCheck
  motherDashboard --> deliveryPrep

  ancTracker --> motherDashboard
  dangerSigns --> motherDashboard
  nutrition --> motherDashboard
  wellnessCheck --> motherDashboard
  deliveryPrep --> motherDashboard

  hewDashboard --> hewMotherDetail
  hewDashboard --> roleSelect
  hewMotherDetail --> hewDashboard
```

---

## 2. Layout composition

```mermaid
flowchart TB
  root[ApplicationRoot]
  pageContainer[PageContainer]
  webHeader[WebHeader]
  motherLayout[MotherLayout]
  hewLayout[HEWLayout]
  sidebar[MotherSidebar lg plus]
  navBar[MotherNavBar below lg]
  main[main content area]

  root --> motherLayout
  root --> hewLayout
  motherLayout --> webHeader
  motherLayout --> pageContainer
  pageContainer --> navBar
  pageContainer --> sidebar
  pageContainer --> main
  hewLayout --> webHeader
  hewLayout --> pageContainer
```

---

## 3. Mother registration and risk

```mermaid
flowchart TD
  step1[Step 1 basic info]
  step2[Step 2 pregnancy info]
  step3[Step 3 health baseline]
  calcWeeks[calcGestationalWeeks]
  calcRisk[calculateRisk]
  save[(saveProfile)]
  dash[MotherDashboard]

  step1 --> step2 --> step3 --> calcWeeks --> calcRisk --> save --> dash
```

---

## 4. AI request flow

```mermaid
sequenceDiagram
  participant User
  participant View as views component
  participant AiLib as lib/ai.ts
  participant Api as app/api/ai/route.ts
  participant OR as OpenRouter

  User->>View: button click
  View->>AiLib: analyzeDangerSigns / getNutritionTip / getWellnessMessage
  AiLib->>Api: POST /api/ai
  Api->>OR: chat completions
  OR-->>Api: text
  Api-->>View: AIResponseBody
  View-->>User: result or fallback
```

---

## 5. Storage

```mermaid
flowchart LR
  views[views] --> storage[lib/storage.ts]
  storage --> profile[materna_mother_profile]
  storage --> anc[materna_anc_contacts]
  storage --> wellness[materna_wellness_history]
  storage --> delivery[materna_delivery_prep]
  storage --> visits[materna_hew_visits]
  profile --> hewHelpers[lib/hewHelpers.ts]
  hewHelpers --> hewDash[HEWDashboard]
```

---

## 6. ANC status logic

```mermaid
flowchart TD
  start[For each ANC contact]
  done{Completed?}
  missed{Weeks past due plus 2?}
  upcoming{Within 2 weeks?}
  completed[completed]
  missedStatus[missed plus escalation panel]
  upcomingStatus[upcoming]
  futureStatus[future]

  start --> done
  done -->|yes| completed
  done -->|no| missed
  missed -->|yes| missedStatus
  missed -->|no| upcoming
  upcoming -->|yes| upcomingStatus
  upcoming -->|no| futureStatus
```

---

## 7. HEW priority sort

```mermaid
flowchart LR
  danger[danger_sign]
  missed[missed_anc]
  nutrition[nutrition_concern]
  wellness[wellness_concern]

  danger --> missed --> nutrition --> wellness
```

---

## 8. Architecture

```mermaid
flowchart TB
  subgraph next [Next.js 16]
    page[app/page.tsx]
    root[ApplicationRoot]
    api[app/api/ai/route.ts]
  end

  subgraph ui [components]
    layouts[layout layer]
    views[views layer]
    widgets[ui layer]
  end

  subgraph lib [lib + data]
    types[types storage ai riskLogic]
    static[data files]
  end

  page --> root --> layouts --> views --> widgets
  views --> lib
  views --> api
  api --> openRouter[OpenRouter API]
```
