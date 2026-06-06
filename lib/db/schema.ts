import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const motherProfiles = pgTable('mother_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  alternativePhone: varchar('alternative_phone', { length: 50 }),
  partnerName: varchar('partner_name', { length: 255 }),
  partnerPhone: varchar('partner_phone', { length: 50 }),
  region: varchar('region', { length: 100 }).notNull(),
  zone: varchar('zone', { length: 100 }),
  woreda: varchar('woreda', { length: 100 }),
  kebele: varchar('kebele', { length: 100 }).notNull(),
  village: varchar('village', { length: 100 }),
  lmp: varchar('lmp', { length: 20 }).notNull(),
  edd: varchar('edd', { length: 20 }),
  gestationalAgeWeeks: integer('gestational_age_weeks').notNull(),
  gravidity: integer('gravidity').notNull(),
  parity: integer('parity').notNull(),
  livingChildren: integer('living_children').default(0),
  plannedPregnancy: boolean('planned_pregnancy'),
  wantedPregnancy: boolean('wanted_pregnancy'),
  multiplePregnancy: boolean('multiple_pregnancy').notNull().default(false),
  previousCSection: boolean('previous_c_section').notNull(),
  previousStillbirth: boolean('previous_stillbirth').notNull(),
  hypertension: boolean('hypertension').notNull(),
  diabetes: boolean('diabetes').notNull(),
  hiv: boolean('hiv').notNull().default(false),
  anemia: boolean('anemia').notNull().default(false),
  tb: boolean('tb').notNull().default(false),
  familySupport: varchar('family_support', { length: 20 }).notNull(),
  mealsPerDay: integer('meals_per_day').notNull(),
  riskLevel: varchar('risk_level', { length: 20 }).notNull(),
  riskFactors: jsonb('risk_factors').$type<string[]>().notNull().default([]),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull(),
  registeredBy: varchar('registered_by', { length: 20 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const motherData = pgTable('mother_data', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  ancContacts: jsonb('anc_contacts').$type<unknown[]>().notNull().default([]),
  wellnessHistory: jsonb('wellness_history')
    .$type<unknown[]>()
    .notNull()
    .default([]),
  deliveryPrep: jsonb('delivery_prep').$type<number[]>().notNull().default([]),
  aiInsights: jsonb('ai_insights').$type<unknown[]>().notNull().default([]),
  dangerReports: jsonb('danger_reports').$type<unknown[]>().notNull().default([]),
  nutritionProfile: jsonb('nutrition_profile').$type<unknown>().notNull().default({}),
  hewVisits: jsonb('hew_visits').$type<unknown[]>().notNull().default([]),
  hewActions: jsonb('hew_actions').$type<unknown[]>().notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type MotherProfileRow = typeof motherProfiles.$inferSelect;
