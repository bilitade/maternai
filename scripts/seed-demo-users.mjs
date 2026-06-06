/**
 * Demo accounts for hackathon / local development.
 *
 * Run: pnpm db:seed
 *
 * Credentials (password for both): demo1234
 *   Mother: demo.mother@materna.et
 *   HEW:    hew@materna.et
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const DEMO_PASSWORD = 'demo1234';

const MOTHER_USER_ID = 'a1000001-0001-4001-8001-000000000001';
const HEW_USER_ID = 'a1000001-0001-4001-8001-000000000002';
const MOTHER_PROFILE_ID = 'b2000002-0002-4002-8002-000000000002';

const MOTHER_EMAIL = 'demo.mother@materna.et';
const HEW_EMAIL = 'hew@materna.et';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

function addDays(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function gestationalWeeksFromLmp(lmp) {
  const ms = Date.now() - new Date(lmp).getTime();
  return Math.max(0, Math.floor(ms / (7 * 24 * 60 * 60 * 1000)));
}

async function main() {
  loadEnvLocal();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Add it to .env.local');
    process.exit(1);
  }

  const sql = neon(url);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const lmp = addDays(new Date().toISOString().slice(0, 10), -22 * 7);
  const edd = addDays(lmp, 280);
  const gestationalWeeks = gestationalWeeksFromLmp(lmp);
  const now = new Date().toISOString();

  const ancContacts = JSON.stringify([
    {
      id: 1,
      completed: true,
      completedDate: addDays(new Date().toISOString().slice(0, 10), -60),
      missed: false,
      missedSince: null,
    },
  ]);

  const dangerReports = JSON.stringify([
    {
      id: 'demo-danger-1',
      date: now,
      signs: ['Severe headache', 'Blurred vision'],
      response:
        'These symptoms together may indicate a serious condition. Please go to your health center today.',
      urgent: true,
      source: 'offline',
    },
  ]);

  const wellnessHistory = JSON.stringify([
    { date: addDays(new Date().toISOString().slice(0, 10), -7), score: 35, answers: [1, 2, 2, 2, 2] },
  ]);

  const aiInsights = JSON.stringify([
    {
      type: 'wellness',
      text: 'Thank you for checking in. Please speak with your health worker if you feel low — support is available.',
      source: 'offline',
      date: now,
      meta: { score: 35 },
    },
  ]);

  const nutritionProfile = JSON.stringify({
    dietaryDiversityScore: 3,
    updatedAt: now,
  });

  const riskFactors = JSON.stringify([
    'Age 35 or older',
    'Previous C-section',
    'Hypertension',
  ]);

  console.log('Seeding demo accounts...');

  await sql`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES
      (${HEW_USER_ID}::uuid, ${HEW_EMAIL}, ${passwordHash}, 'Almaz Kebede', 'hew'),
      (${MOTHER_USER_ID}::uuid, ${MOTHER_EMAIL}, ${passwordHash}, 'Tigist Bekele', 'mother')
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      role = EXCLUDED.role
  `;

  await sql`
    INSERT INTO mother_profiles (
      id, user_id, name, age, phone, alternative_phone, partner_name, partner_phone,
      region, zone, woreda, kebele, village, lmp, edd, gestational_age_weeks,
      gravidity, parity, living_children, planned_pregnancy, wanted_pregnancy,
      multiple_pregnancy, previous_c_section, previous_stillbirth,
      hypertension, diabetes, hiv, anemia, tb,
      family_support, meals_per_day, risk_level, risk_factors,
      registered_at, registered_by
    ) VALUES (
      ${MOTHER_PROFILE_ID}::uuid,
      ${MOTHER_USER_ID}::uuid,
      'Tigist Bekele',
      38,
      '+251911000001',
      '+251922000001',
      'Daniel Bekele',
      '+251933000001',
      'Addis Ababa',
      'Addis Ababa',
      'Bole',
      'Bole 03',
      'Got 12',
      ${lmp},
      ${edd},
      ${gestationalWeeks},
      2,
      1,
      1,
      true,
      true,
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
      ${riskFactors}::jsonb,
      ${now}::timestamptz,
      'self'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      name = EXCLUDED.name,
      age = EXCLUDED.age,
      phone = EXCLUDED.phone,
      lmp = EXCLUDED.lmp,
      edd = EXCLUDED.edd,
      gestational_age_weeks = EXCLUDED.gestational_age_weeks,
      risk_level = EXCLUDED.risk_level,
      risk_factors = EXCLUDED.risk_factors,
      hypertension = EXCLUDED.hypertension,
      previous_c_section = EXCLUDED.previous_c_section,
      anemia = EXCLUDED.anemia,
      kebele = EXCLUDED.kebele,
      updated_at = NOW()
  `;

  await sql`
    INSERT INTO mother_data (
      user_id, anc_contacts, wellness_history, delivery_prep,
      ai_insights, danger_reports, nutrition_profile, hew_visits, hew_actions
    ) VALUES (
      ${MOTHER_USER_ID}::uuid,
      ${ancContacts}::jsonb,
      ${wellnessHistory}::jsonb,
      '[]'::jsonb,
      ${aiInsights}::jsonb,
      ${dangerReports}::jsonb,
      ${nutritionProfile}::jsonb,
      '[]'::jsonb,
      '[]'::jsonb
    )
    ON CONFLICT (user_id) DO UPDATE SET
      anc_contacts = EXCLUDED.anc_contacts,
      wellness_history = EXCLUDED.wellness_history,
      ai_insights = EXCLUDED.ai_insights,
      danger_reports = EXCLUDED.danger_reports,
      nutrition_profile = EXCLUDED.nutrition_profile,
      updated_at = NOW()
  `;

  console.log('');
  console.log('Demo accounts ready:');
  console.log('  Mother  →', MOTHER_EMAIL, '/', DEMO_PASSWORD);
  console.log('  HEW     →', HEW_EMAIL, '/', DEMO_PASSWORD);
  console.log('');
  console.log(`Mother profile: week ${gestationalWeeks}, high risk, Bole 03`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
