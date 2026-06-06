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
  role: varchar('role', { length: 20 }).notNull(), // mother | hew
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
  region: varchar('region', { length: 100 }).notNull(),
  kebele: varchar('kebele', { length: 100 }).notNull(),
  lmp: varchar('lmp', { length: 20 }).notNull(),
  gestationalAgeWeeks: integer('gestational_age_weeks').notNull(),
  gravidity: integer('gravidity').notNull(),
  parity: integer('parity').notNull(),
  previousCSection: boolean('previous_c_section').notNull(),
  previousStillbirth: boolean('previous_stillbirth').notNull(),
  hypertension: boolean('hypertension').notNull(),
  diabetes: boolean('diabetes').notNull(),
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
  hewVisits: jsonb('hew_visits').$type<unknown[]>().notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type MotherProfileRow = typeof motherProfiles.$inferSelect;
