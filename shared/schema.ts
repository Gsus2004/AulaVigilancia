import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('teacher'),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: text("grade").notNull(),
  email: text("email"),
  tabletId: text("tablet_id").unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tablets = pgTable("tablets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tabletNumber: text("tablet_number").notNull().unique(),
  studentId: varchar("student_id").references(() => students.id),
  status: text("status").notNull().default('offline'), // 'online', 'offline', 'warning', 'blocked'
  lastActivity: timestamp("last_activity"),
  currentApp: text("current_app"),
  currentUrl: text("current_url"),
  screenTime: integer("screen_time").default(0), // in minutes
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  tabletId: varchar("tablet_id").notNull().references(() => tablets.id),
  activityType: text("activity_type").notNull(), // 'web_navigation', 'app_usage', 'search'
  application: text("application"),
  url: text("url"),
  title: text("title"),
  category: text("category"), // 'educational', 'entertainment', 'social', 'inappropriate'
  duration: integer("duration").default(0), // in minutes
  isBlocked: boolean("is_blocked").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  tabletId: varchar("tablet_id").notNull().references(() => tablets.id),
  alertType: text("alert_type").notNull(), // 'inappropriate_content', 'excessive_time', 'blocked_download', 'unauthorized_app'
  severity: text("severity").notNull().default('medium'), // 'low', 'medium', 'high'
  title: text("title").notNull(),
  description: text("description"),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blockedSites = pgTable("blocked_sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  category: text("category").notNull(),
  reason: text("reason"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const securityPolicies = pgTable("security_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  rules: jsonb("rules").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const studentsRelations = relations(students, ({ one, many }) => ({
  tablet: one(tablets, {
    fields: [students.tabletId],
    references: [tablets.tabletNumber],
  }),
  activities: many(activities),
  alerts: many(alerts),
}));

export const tabletsRelations = relations(tablets, ({ one, many }) => ({
  student: one(students, {
    fields: [tablets.studentId],
    references: [students.id],
  }),
  activities: many(activities),
  alerts: many(alerts),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  student: one(students, {
    fields: [activities.studentId],
    references: [students.id],
  }),
  tablet: one(tablets, {
    fields: [activities.tabletId],
    references: [tablets.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  student: one(students, {
    fields: [alerts.studentId],
    references: [students.id],
  }),
  tablet: one(tablets, {
    fields: [alerts.tabletId],
    references: [tablets.id],
  }),
  resolver: one(users, {
    fields: [alerts.resolvedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertTabletSchema = createInsertSchema(tablets).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertBlockedSiteSchema = createInsertSchema(blockedSites).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityPolicySchema = createInsertSchema(securityPolicies).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Tablet = typeof tablets.$inferSelect;
export type InsertTablet = z.infer<typeof insertTabletSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type BlockedSite = typeof blockedSites.$inferSelect;
export type InsertBlockedSite = z.infer<typeof insertBlockedSiteSchema>;

export type SecurityPolicy = typeof securityPolicies.$inferSelect;
export type InsertSecurityPolicy = z.infer<typeof insertSecurityPolicySchema>;
