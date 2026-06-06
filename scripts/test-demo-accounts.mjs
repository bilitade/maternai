/**
 * Integration test: demo accounts login + API access
 * Run: node scripts/test-demo-accounts.mjs [baseUrl]
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const MOTHER_EMAIL = 'demo.mother@materna.et';
const HEW_EMAIL = 'hew@materna.et';
const PASSWORD = 'demo1234';

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

function parseCookies(setCookieHeaders) {
  const jar = {};
  for (const h of setCookieHeaders) {
    const part = h.split(';')[0];
    const eq = part.indexOf('=');
    if (eq > 0) jar[part.slice(0, eq)] = part.slice(eq + 1);
  }
  return jar;
}

function cookieHeader(jar) {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function signIn(email) {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  if (!csrfRes.ok) throw new Error(`CSRF failed: ${csrfRes.status}`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = parseCookies(csrfRes.headers.getSetCookie?.() ?? []);

  const body = new URLSearchParams({
    csrfToken,
    email,
    password: PASSWORD,
    redirect: 'false',
    json: 'true',
  });

  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeader(csrfCookies),
    },
    body,
    redirect: 'manual',
  });

  const loginCookies = parseCookies(res.headers.getSetCookie?.() ?? []);
  const jar = { ...csrfCookies, ...loginCookies };

  const sessionRes = await fetch(`${BASE}/api/auth/session`, {
    headers: { Cookie: cookieHeader(jar) },
  });
  const session = await sessionRes.json();

  return { jar, session, status: res.status };
}

async function testDb() {
  loadEnvLocal();
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`
    SELECT email, role, name FROM users
    WHERE email IN (${MOTHER_EMAIL}, ${HEW_EMAIL})
    ORDER BY email
  `;
  const profiles = await sql`
    SELECT mp.name, mp.kebele, mp.risk_level, mp.gestational_age_weeks, u.email
    FROM mother_profiles mp
    JOIN users u ON u.id = mp.user_id
    WHERE u.email = ${MOTHER_EMAIL}
  `;
  return { users, profiles };
}

let passed = 0;
let failed = 0;

function ok(label) {
  passed++;
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed++;
  console.log(`  ✗ ${label}${detail ? `: ${detail}` : ''}`);
}

async function main() {
  console.log('=== MaternaAI demo account tests ===\n');

  console.log('1. Database seed verification');
  try {
    const { users, profiles } = await testDb();
    if (users.length === 2) ok('Both demo users exist in DB');
    else fail('Both demo users exist in DB', `found ${users.length}`);

    const hew = users.find((u) => u.email === HEW_EMAIL);
    const mother = users.find((u) => u.email === MOTHER_EMAIL);
    if (hew?.role === 'hew') ok('HEW role correct');
    else fail('HEW role correct', hew?.role);
    if (mother?.role === 'mother') ok('Mother role correct');
    else fail('Mother role correct', mother?.role);

    if (profiles.length === 1 && profiles[0].risk_level === 'high') {
      ok(`Mother profile: ${profiles[0].name}, ${profiles[0].kebele}, week ${profiles[0].gestational_age_weeks}, high risk`);
    } else fail('Mother profile with high risk', JSON.stringify(profiles[0]));
  } catch (err) {
    fail('Database check', err.message);
  }

  console.log('\n2. App health');
  try {
    const home = await fetch(`${BASE}/`);
    if (home.ok) ok(`GET / → ${home.status}`);
    else fail(`GET /`, String(home.status));
  } catch (err) {
    fail('App reachable', err.message);
    console.log('\nStart the app: pnpm dev');
    process.exit(1);
  }

  console.log('\n3. Mother login + /api/mother');
  try {
    const { jar, session } = await signIn(MOTHER_EMAIL);
    if (session?.user?.email === MOTHER_EMAIL) ok('Mother session created');
    else fail('Mother session', JSON.stringify(session));

    if (session?.user?.hasProfile === true) ok('Mother hasProfile=true');
    else fail('Mother hasProfile', String(session?.user?.hasProfile));

    const motherRes = await fetch(`${BASE}/api/mother`, {
      headers: { Cookie: cookieHeader(jar) },
    });
    if (motherRes.ok) {
      const data = await motherRes.json();
      if (data.profile?.name === 'Tigist Bekele') ok('GET /api/mother returns Tigist Bekele');
      else fail('Mother profile name', data.profile?.name);
      if (data.dangerReports?.length > 0) ok('Danger reports present for HEW flag demo');
      else fail('Danger reports', 'empty');
    } else fail('GET /api/mother', String(motherRes.status));
  } catch (err) {
    fail('Mother login flow', err.message);
  }

  console.log('\n4. HEW login + /api/hew/mothers');
  try {
    const { jar, session } = await signIn(HEW_EMAIL);
    if (session?.user?.email === HEW_EMAIL && session?.user?.role === 'hew') {
      ok('HEW session created');
    } else fail('HEW session', JSON.stringify(session));

    const hewRes = await fetch(`${BASE}/api/hew/mothers`, {
      headers: { Cookie: cookieHeader(jar) },
    });
    if (hewRes.ok) {
      const data = await hewRes.json();
      const tigist = data.mothers?.find((m) => m.name === 'Tigist Bekele');
      if (tigist) ok(`HEW sees Tigist Bekele (flags: ${tigist.flags.join(', ') || 'none'})`);
      else fail('HEW mother list', `count=${data.mothers?.length}`);
      if (tigist?.riskLevel === 'high') ok('HEW sees high-risk badge');
      else fail('HEW risk level', tigist?.riskLevel);
    } else {
      const text = await hewRes.text();
      fail('GET /api/hew/mothers', `${hewRes.status} ${text.slice(0, 80)}`);
    }
  } catch (err) {
    fail('HEW login flow', err.message);
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
