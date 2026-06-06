# MaternaAI Ethiopia — ማተርናኤአይ
### AI-Powered Maternal Continuity-of-Care Platform
**Wellness Hackathon 2026 · ALX Ethiopia · Final Presentation — June 14**

---

## 1. The Big Idea

Every year, **12,000 Ethiopian mothers die** — 85% from causes that are preventable with timely information and follow-up. The Health Extension Program reaches the last mile. But between home visits, women disappear from care. Appointments are missed. Danger signs go unrecognized. Postpartum depression is never named.

**MaternaAI closes that gap.**

It is an AI-powered maternal wellness and continuity-of-care platform connecting pregnant women, Health Extension Workers (HEWs), and health centers — from pregnancy identification through postpartum recovery — built entirely around Ethiopia's existing health system architecture.

This is not a generic chatbot. It is a system that speaks the language of kebeles, ANC contacts, family folders, and HEWs — because that is the system Ethiopian women already live inside.

---

## 2. The Problem

### 2.1 Ethiopia's Maternal Health Crisis

**Maternal mortality:** Ethiopia's MMR stands at **267–401 deaths per 100,000 live births** (WHO 2020; Ethiopia MOH 2017) — approximately **12,000 mothers dying every year**, 85% from preventable causes. The lifetime risk of dying from maternal causes is **1 in 52 women** (Borde et al., 2023). Over **3,500 women develop obstetric fistula annually** (UNFPA Ethiopia).

**Antenatal care gaps:** Ethiopia's ANC4+ coverage remains critically low. Women who initiate care often drop out before completing the WHO-recommended eight contacts — not because they don't care, but because no system actively follows them when they go silent.

**Mental health:** A national meta-analysis found **20.1% of Ethiopian mothers develop postpartum depression** (BMC Psychiatry, 2021) — rising to **37.4% among adolescent mothers** (Kassa et al., 2024). In Addis Ababa specifically, prevalence is **23.8%** (Frontiers in Public Health, 2022). It is almost never diagnosed or treated. Stigma is the primary barrier.

**Nutrition:** The EDHS (2016) found **27.3% of reproductive-age women are anemic** — directly preventable through nutrition education that no tool currently delivers in a contextually appropriate way for Ethiopian households.

**Access:** Approximately **1 OB/GYN per 100,000+ women** nationally. A 2023 *Scientific Reports* study found three-quarters of women in Ethiopia's emerging regions face barriers to healthcare access (Fetene & Haile, 2023).

### 2.2 The Specific Gap MaternaAI Fills

Ethiopia has a remarkable asset: **38,000+ Health Extension Workers** deployed to every kebele in the country. They identify pregnant women, conduct home visits, and refer to health centers. But they use paper family folders. There is no system that tells a HEW which mother missed her ANC appointment two weeks ago. There is no tool that flags a mother showing signs of preeclampsia between visits. There is no platform that tracks a woman's mental wellness from the third trimester through six weeks postpartum.

MaternaAI builds that system — lightweight, responsive web app designed for low-connectivity browsers.

---

## 3. The Product — Eight Core Capabilities

### Capability 1 — Pregnancy Registration & Maternal Profile
A HEW or the mother herself registers directly in the app:

- Name, age, kebele, household ID, phone number
- Last menstrual period → auto-calculated gestational age
- Region / Zone / Woreda / Kebele hierarchy (mirrors Ethiopia's administrative structure)

The system creates a **Maternal Wellness Profile** that follows the woman through every subsequent interaction.

### Capability 2 — AI Risk Stratification at Registration
Questions drawn from the Ethiopian ANC guideline and WHO ANC recommendations assess:

- **Maternal factors:** age, gravidity, parity, previous stillbirth, previous C-section
- **Medical history:** hypertension, diabetes, HIV status
- **Nutrition:** meal frequency, dietary diversity
- **Mental wellness:** stress, anxiety, social support baseline

The AI outputs a three-tier risk classification:

> 🟢 **Low Risk** — Standard ANC follow-up schedule  
> 🟡 **Needs Closer Monitoring** — Additional HEW visits recommended  
> 🔴 **High Risk Pregnancy** — Immediate health center referral triggered

Example: Age 39 + previous C-section + history of hypertension → **High-Risk Pregnancy** flag on registration.

### Capability 3 — ANC Contact Tracking (WHO 8-Contact Model)
The mother's dashboard tracks all eight WHO-recommended ANC contacts:

- Completed contacts shown with date and notes
- Upcoming contact shown with countdown
- Missed contacts trigger the escalation workflow (see Capability 4)

This gives every mother — and every HEW — a single source of truth on where she stands in her pregnancy journey.

### Capability 4 — Missed ANC Detection & Escalation
This is where MaternaAI becomes genuinely life-saving.

When an ANC contact is overdue, the system does not wait:

| Day | Action |
|-----|--------|
| Day 1 past due | Automated SMS reminder to mother |
| Day 7 | Second reminder + HEW notification |
| Day 14 | HEW flagged for home visit |
| Day 21 | Health center dashboard alert escalated |

Current systems record visits. MaternaAI actively identifies mothers who have disappeared from care and pulls them back.

### Capability 5 — Danger Sign Detection
The mother selects symptoms from a simple visual checklist. The AI screens combinations in real time:

**Monitored danger signs:**
- Vaginal bleeding
- Severe headache
- Convulsions
- Blurred vision
- Reduced fetal movement
- Severe swelling of face/hands/feet

**Example trigger:**  
Severe headache + blurred vision + swelling →

> *"These symptoms together may indicate preeclampsia. Go to a health center immediately. Your HEW has been notified."*

The mother receives immediate guidance. The HEW receives an urgent follow-up alert. Both actions happen in one tap.

### Capability 6 — Ethiopian Maternal Nutrition Assistant
Most pregnancy nutrition apps recommend salmon, avocado, and blueberries. Ethiopian households eat injera, shiro, gomen, lentils, and atmit.

MaternaAI's nutrition engine is built on Ethiopian foods:

| Nutrient | Recommended local sources |
|----------|--------------------------|
| Iron | Shiro, lentils, chickpeas, gomen (kale) |
| Protein | Eggs, milk, beans, ater kik |
| Folate | Liver, split peas, dark leafy greens |
| Energy | Injera, barley porridge, atmit |
| Calcium | Milk, yogurt, sesame (in fitfit) |

Advice is trimester-specific:
- **First trimester:** Managing nausea with local bland foods
- **Second trimester:** Growth support and iron optimization
- **Third trimester:** Energy foods and birth preparation nutrition

### Capability 7 — Maternal Mental Wellness Tracking
Weekly check-in questions drawn from validated screening tools, adapted for Ethiopian cultural context:

- Have you felt hopeless or without purpose this week?
- Have you felt excessive worry about your baby or pregnancy?
- Are you sleeping and eating adequately?
- Do you feel supported by family?

The AI generates a **Maternal Wellness Score (0–100)** composed of four components: nutrition adherence, ANC compliance, mental wellbeing, and physical symptom burden. Declining scores over three consecutive weeks trigger a gentle, non-judgmental prompt and connect the mother to a crisis resource.

### Capability 8 — HEW Priority Dashboard
The HEW's dashboard is a living, prioritized action list:

**Priority flags:**
- 🔴 Danger sign cases — act today
- 🟠 Missed ANC cases — schedule home visit
- 🟡 Nutrition concern cases — send dietary guidance
- 🔵 Mental wellness concerns — weekly follow-up call

**Home visit planner:** Organizes mothers by kebele location and urgency. A HEW serving 25–30 households can open the app and see exactly who needs attention this week, rather than manually reviewing paper family folders.

---

## 4. User Journeys

### Journey A — Tigist, 24, Bole Lemi industrial park
Tigist is 14 weeks pregnant and registered by her kebele HEW. She works long shifts and misses ANC 3. On Day 7, her HEW receives a missed ANC notification and calls her. She reschedules. Without MaternaAI, she would have continued unmonitored.

### Journey B — Hiwot, 31, peri-urban Addis
Six weeks postpartum, Hiwot's weekly wellness check-ins show three consecutive low mood scores. MaternaAI flags her to her HEW and surfaces a gentle message: *"Feeling this way after birth is common and has a name. You are not alone. Here is support."* She is referred before her PPD deepens.

### Journey C — Selamawit, 38, Lideta
Registers at 22 weeks. Age + previous C-section + hypertension history → immediate High-Risk classification. Health center notified at registration. She receives enhanced ANC contact scheduling from Week 1. Her risk is managed from the first interaction.

---

## 5. Scope

### 5.1 In Scope — 8-Day Build (June 6–13)

| Feature | Build Priority | Est. Hours |
|---|---|---|
| Maternal registration + profile creation | Core | 3 hrs |
| AI risk stratification (3-tier output) | Core | 3 hrs |
| ANC contact tracking (8 contacts) | Core | 3 hrs |
| Missed ANC detection + escalation logic | Core | 3 hrs |
| Danger sign detection + AI response | Core | 3 hrs |
| Ethiopian food nutrition assistant | Differentiator | 4 hrs |
| Maternal wellness score + weekly check-in | Differentiator | 3 hrs |
| HEW priority dashboard | Differentiator | 4 hrs |
| Delivery preparedness checklist | Strong | 2 hrs |
| Postpartum wellness tracking (mother + baby) | Strong | 2 hrs |
| Amharic / English language toggle | Expected | 2 hrs |
| Onboarding + splash screen | Expected | 1.5 hrs |
| Vercel deployment | Expected | 0.5 hrs |

**Total estimated: ~34 hours over 8 days — achievable for one developer with domain support.**

### 5.2 Out of Scope — Post-Hackathon Roadmap

| Feature | Reason Deferred |
|---|---|
| Live SMS gateway integration | Requires backend + Telebirr/Ethio Telecom API |
| Push notifications | Requires service workers + backend |
| Offline-first sync | Requires PWA architecture + conflict resolution |
| Real clinic finder with live data | Requires backend + mapping API |
| Native iOS/Android app | Time and cost |
| Regional languages (Oromiffa, Tigrinya, Somali) | Language data + testing |
| Telemedicine with verified doctors | Regulatory requirement |
| Integration with DHIS2 (national HIS) | Requires government partnership |

### 5.3 Technical Architecture

```
Frontend:   Next.js 16 + TypeScript + Tailwind CSS v4
AI Layer:   OpenRouter (Llama 3.3 70B) via /api/ai route
Storage:    localStorage (all user data — no backend at MVP)
Charts:     Recharts (wellness score trend)
Language:   i18n stub in lib/strings.ts (Amharic deferred)
Deploy:     Vercel
```

---

## 6. Revenue Model

MaternaAI is designed for institutional buyers, not consumer app store economics. The strongest revenue path runs through the organizations already funding maternal health in Ethiopia.

| Stream | Mechanism | Year 1 Target |
|---|---|---|
| **NGO / donor licensing** | License MaternaAI to UNFPA, Jhpiego, Marie Stopes, MSH Ethiopia for digital health programs — priced per active user or per project | 1–2 contracts → 500K–1M ETB |
| **Regional Health Bureau contracts** | White-label deployment for regional maternal health programs; Amhara, Oromia, SNNP regions each manage 5,000–20,000+ HEWs | 1 regional contract → 800K ETB/yr |
| **B2B — industrial parks** | "MaternaAI for Employers" — maternal wellness platform for female workers; HR buys per-employee access. 100,000+ women work in Addis Ababa's industrial parks (Bole Lemi, Kilinto, Hawassa). Unmet contraceptive need is 27.4% among this cohort (PMC, 2024) | 3 factories × 20K ETB/month → 720K ETB |
| **Premium mother version** | AI coach, personalized nutrition planner, enhanced wellness insights, Doctor/Midwife Brief generator | Year 2 |
| **Anonymized health data insights** | Aggregate, anonymized population-level maternal wellness trends for researchers and public health bodies (explicit consent) | Year 2–3 |

**Year 1 Conservative Total: ~2M–2.5M ETB**

The NGO/donor path is the fastest to close: Jhpiego, UNICEF, and MSH Ethiopia are already active in Ethiopia with digital health budgets. A functional MVP with real HEW workflow integration is exactly the kind of evidence they fund.

---

## 7. Competitive Advantage

| | MaternaAI | Flo / Clue | YeneHealth | Other hackathon teams |
|---|---|---|---|---|
| Built around Ethiopia's HEP structure | ✅ | ❌ | ❌ | ❌ |
| HEW priority dashboard | ✅ | ❌ | ❌ | ❌ |
| Missed ANC detection + escalation | ✅ | ❌ | ❌ | ❌ |
| AI risk stratification at registration | ✅ | ❌ | Limited | ❌ |
| Danger sign detection | ✅ | Limited | ❌ | ❌ |
| Ethiopian food nutrition engine | ✅ | ❌ | ❌ | ❌ |
| Maternal wellness score | ✅ | ❌ | ❌ | ❌ |
| Amharic language | ✅ | ❌ | Partial | Maybe |
| Works on any phone browser | ✅ | App required | App required | Varies |
| Institutional B2B revenue model | ✅ | ❌ | Partial | ❌ |

The moat is not any single feature — it is the combination of clinical depth (ANC model, risk stratification, danger signs) with HEW workflow integration and Ethiopian nutritional context. Each component alone is a differentiator. Together, they make a product that cannot be replicated quickly by a team without public health domain knowledge.

---

## 8. Go-to-Market

**Now (Hackathon → Month 1):** Win. Use prize money and ALX incubation to fund a 3-month post-hackathon sprint. Launch pilot with 2–3 HEWs in Addis Ababa through ALX/WeVa Sphere network connections.

**Month 1–3:** Refine HEW workflow with real user feedback. Build offline-first capability. Approach Jhpiego Ethiopia and Marie Stopes Ethiopia for pilot partnership conversations.

**Month 4–6:** Deploy pilot with one woreda (sub-district). Collect outcome data — specifically missed ANC rates before and after MaternaAI. That data is the grant application.

**Month 7–12:** Apply for UNFPA Digital Health Innovation Fund and Bill & Melinda Gates Foundation maternal health grants. Approach Bole Lemi and Kilinto industrial park HR teams with employer maternal wellness proposal. Target first Regional Health Bureau contract.

---

## 9. The Demo Plan (June 14 — 5-Minute Sequence)

1. **Registration** — HEW opens app, registers a new pregnant mother: name, kebele, LMP. System calculates gestational age automatically. (30 sec)

2. **Risk stratification** — Enter: age 38, previous C-section, history of hypertension. Show the AI output: **🔴 High-Risk Pregnancy** — health center notification triggered. (30 sec)

3. **ANC dashboard** — Show the mother's ANC contact tracker. Mark ANC 3 as missed. Show the escalation timeline fire — Day 1 SMS reminder logged, Day 7 HEW notification queued. (30 sec)

4. **Danger sign detection** — Mother taps: severe headache + blurred vision + facial swelling. Show AI response: *"These symptoms may indicate preeclampsia. Go to a health center immediately. Your HEW has been notified."* (20 sec)

5. **Nutrition tip** — Navigate to nutrition assistant. Third trimester. Show Ethiopian food recommendations for iron and energy: gomen, ater kik, atmit. (15 sec)

6. **HEW dashboard** — Switch to HEW view. Show the priority list: 1 danger sign case (red), 2 missed ANC cases (orange), 1 mental wellness concern (blue). (15 sec)

7. **Close:** *"This is what continuity of care looks like when it's built for Ethiopia. Not for a Western user with a fitbit — for a HEW in Lideta with 30 mothers on her list and no system to tell her who needs her today. MaternaAI is that system."*

---

## 10. Judging Criteria Alignment

| Criterion | MaternaAI's Response |
|---|---|
| **Tech-driven solution** | React + Claude AI API + Recharts; deployable on any phone browser; AI performs clinical risk stratification and danger sign detection in real time |
| **Real wellness challenge** | Maternal health + mental wellness + nutrition — backed by WHO, MOH Ethiopia, UNFPA, BMC Psychiatry, and Ethiopian EDHS data |
| **Sustainable revenue model** | Institutional B2B + NGO/donor licensing — realistic buyers with documented budgets already operating in Ethiopia |
| **Community impact** | Ethiopia's 38,000+ HEWs serve every kebele; MaternaAI amplifies each one; architecture is portable to any country using community health worker models |
| **Innovation** | HEW-integrated missed ANC detection, AI risk stratification at registration, and Ethiopian-context nutrition engine — no comparable product exists in Ethiopia or sub-Saharan Africa |

---

## 11. The Team

This project is built at the intersection of two disciplines that rarely share a team: software engineering and public health. The AI and product architecture is built by a developer with direct experience building AI-powered applications. The clinical workflow, ANC protocols, HEW dashboard logic, and danger sign criteria are designed by a teammate with deep expertise in Ethiopia's Health Extension Program and maternal and child health delivery systems.

That combination is the product. Neither half works without the other.

---

## 12. The One-Sentence Pitch

> *"MaternaAI is the first platform that thinks like a HEW: it knows which mother missed her ANC appointment, recognizes preeclampsia signals before the next home visit, and has already done the follow-up — because in Ethiopia, the gap between a missed appointment and a preventable death is measured in days."*