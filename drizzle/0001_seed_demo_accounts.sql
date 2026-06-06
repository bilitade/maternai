-- Demo auth accounts for MaternaAI (hackathon / local dev)
-- Password for both accounts: demo1234
-- Prefer running: pnpm db:seed (updates LMP to current gestational age)
--
-- Mother: demo.mother@materna.et
-- HEW:    hew@materna.et

-- bcrypt hash for "demo1234" (cost 10)
-- $2b$10$xGm.yWVc7h3f2UouxESmTeAFpwChWUX42ryEvxrAQ9pbiZ9H4r8uC

INSERT INTO users (id, email, password_hash, name, role)
VALUES
  (
    'a1000001-0001-4001-8001-000000000002'::uuid,
    'hew@materna.et',
    '$2b$10$xGm.yWVc7h3f2UouxESmTeAFpwChWUX42ryEvxrAQ9pbiZ9H4r8uC',
    'Almaz Kebede',
    'hew'
  ),
  (
    'a1000001-0001-4001-8001-000000000001'::uuid,
    'demo.mother@materna.et',
    '$2b$10$xGm.yWVc7h3f2UouxESmTeAFpwChWUX42ryEvxrAQ9pbiZ9H4r8uC',
    'Tigist Bekele',
    'mother'
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

INSERT INTO mother_profiles (
  id, user_id, name, age, phone, region, kebele, lmp, edd,
  gestational_age_weeks, gravidity, parity, living_children,
  multiple_pregnancy, previous_c_section, previous_stillbirth,
  hypertension, diabetes, hiv, anemia, tb,
  family_support, meals_per_day, risk_level, risk_factors,
  registered_at, registered_by
)
VALUES (
  'b2000002-0002-4002-8002-000000000002'::uuid,
  'a1000001-0001-4001-8001-000000000001'::uuid,
  'Tigist Bekele',
  38,
  '+251911000001',
  'Addis Ababa',
  'Bole 03',
  (CURRENT_DATE - INTERVAL '22 weeks')::date::text,
  (CURRENT_DATE - INTERVAL '22 weeks' + INTERVAL '280 days')::date::text,
  22,
  2,
  1,
  1,
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
  'yes',
  3,
  'high',
  '["Age 35 or older", "Previous C-section", "Hypertension"]'::jsonb,
  NOW(),
  'self'
)
ON CONFLICT (user_id) DO UPDATE SET
  gestational_age_weeks = EXCLUDED.gestational_age_weeks,
  lmp = EXCLUDED.lmp,
  edd = EXCLUDED.edd,
  risk_level = EXCLUDED.risk_level,
  risk_factors = EXCLUDED.risk_factors,
  updated_at = NOW();

INSERT INTO mother_data (
  user_id, anc_contacts, wellness_history, delivery_prep,
  ai_insights, danger_reports, nutrition_profile
)
VALUES (
  'a1000001-0001-4001-8001-000000000001'::uuid,
  '[{"id":1,"completed":true,"completedDate":"2026-01-01","missed":false,"missedSince":null}]'::jsonb,
  '[{"date":"2026-06-01","score":35,"answers":[1,2,2,2,2]}]'::jsonb,
  '[]'::jsonb,
  '[{"type":"wellness","text":"Please speak with your health worker if you feel low.","source":"offline","date":"2026-06-06T00:00:00.000Z","meta":{"score":35}}]'::jsonb,
  '[{"id":"demo-danger-1","date":"2026-06-06T00:00:00.000Z","signs":["Severe headache","Blurred vision"],"response":"Go to your health center today.","urgent":true,"source":"offline"}]'::jsonb,
  '{"dietaryDiversityScore":3}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
  anc_contacts = EXCLUDED.anc_contacts,
  wellness_history = EXCLUDED.wellness_history,
  ai_insights = EXCLUDED.ai_insights,
  danger_reports = EXCLUDED.danger_reports,
  nutrition_profile = EXCLUDED.nutrition_profile,
  updated_at = NOW();
