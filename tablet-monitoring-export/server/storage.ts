import { 
  users, students, tablets, activities, alerts, blockedSites, securityPolicies,
  type User, type InsertUser, type Student, type InsertStudent, 
  type Tablet, type InsertTablet, type Activity, type InsertActivity,
  type Alert, type InsertAlert, type BlockedSite, type InsertBlockedSite,
  type SecurityPolicy, type InsertSecurityPolicy
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, isNull, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Students
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student>;

  // Tablets
  getAllTablets(): Promise<any[]>; // Returns tablets with student info
  getTablet(id: string): Promise<Tablet | undefined>;
  createTablet(tablet: InsertTablet): Promise<Tablet>;
  updateTabletStatus(id: string, status: string, isBlocked?: boolean): Promise<Tablet>;
  getTabletActivities(tabletId: string): Promise<any[]>; // Returns activities with student info
  lockAllTablets(): Promise<void>;
  blockSiteForTablet(tabletId: string, url: string, reason: string): Promise<void>;

  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getStudentActivities(studentId: string, startDate?: string, endDate?: string): Promise<Activity[]>;

  // Alerts
  getAlerts(resolved?: boolean): Promise<any[]>; // Returns alerts with student/tablet info
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: string, resolvedBy: string): Promise<Alert>;

  // Blocked Sites
  getBlockedSites(): Promise<BlockedSite[]>;
  createBlockedSite(site: InsertBlockedSite): Promise<BlockedSite>;
  deleteBlockedSite(id: string): Promise<void>;

  // Security Policies
  getSecurityPolicies(): Promise<SecurityPolicy[]>;
  createSecurityPolicy(policy: InsertSecurityPolicy): Promise<SecurityPolicy>;
  updateSecurityPolicy(id: string, updates: Partial<InsertSecurityPolicy>): Promise<SecurityPolicy>;

  // Dashboard
  getDashboardStats(): Promise<{
    activeTablets: number;
    totalTablets: number;
    activeAlerts: number;
    averageTime: number;
    blockedSites: number;
  }>;

  // Reports
  generatePDFReport(type: string, startDate: string, endDate: string, studentId?: string): Promise<Buffer>;
  generateExcelReport(type: string, startDate: string, endDate: string, studentId?: string): Promise<Buffer>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(desc(students.createdAt));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async updateStudent(id: string, updates: Partial<InsertStudent>): Promise<Student> {
    const [student] = await db
      .update(students)
      .set(updates)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async getAllTablets(): Promise<any[]> {
    const result = await db
      .select({
        id: tablets.id,
        tabletNumber: tablets.tabletNumber,
        status: tablets.status,
        lastActivity: tablets.lastActivity,
        currentApp: tablets.currentApp,
        currentUrl: tablets.currentUrl,
        screenTime: tablets.screenTime,
        isBlocked: tablets.isBlocked,
        createdAt: tablets.createdAt,
        student: {
          id: students.id,
          name: students.name,
          grade: students.grade,
        }
      })
      .from(tablets)
      .leftJoin(students, eq(tablets.studentId, students.id))
      .orderBy(tablets.tabletNumber);
    
    return result.map(row => ({
      ...row,
      student: row.student.id ? row.student : undefined
    }));
  }

  async getTablet(id: string): Promise<Tablet | undefined> {
    const [tablet] = await db.select().from(tablets).where(eq(tablets.id, id));
    return tablet || undefined;
  }

  async createTablet(insertTablet: InsertTablet): Promise<Tablet> {
    const [tablet] = await db
      .insert(tablets)
      .values(insertTablet)
      .returning();
    return tablet;
  }

  async updateTabletStatus(id: string, status: string, isBlocked?: boolean): Promise<Tablet> {
    const updateData: any = { status };
    if (isBlocked !== undefined) {
      updateData.isBlocked = isBlocked;
    }
    
    const [tablet] = await db
      .update(tablets)
      .set(updateData)
      .where(eq(tablets.id, id))
      .returning();
    return tablet;
  }

  async getTabletActivities(tabletId: string): Promise<any[]> {
    const result = await db
      .select({
        id: activities.id,
        activityType: activities.activityType,
        application: activities.application,
        url: activities.url,
        title: activities.title,
        category: activities.category,
        duration: activities.duration,
        isBlocked: activities.isBlocked,
        timestamp: activities.timestamp,
        student: {
          id: students.id,
          name: students.name,
        }
      })
      .from(activities)
      .leftJoin(students, eq(activities.studentId, students.id))
      .where(eq(activities.tabletId, tabletId))
      .orderBy(desc(activities.timestamp))
      .limit(10);
    
    return result;
  }

  async lockAllTablets(): Promise<void> {
    await db
      .update(tablets)
      .set({ status: 'blocked', isBlocked: true })
      .where(eq(tablets.status, 'online'));
  }

  async blockSiteForTablet(tabletId: string, url: string, reason: string): Promise<void> {
    // Add to blocked sites list
    await db.insert(blockedSites).values({
      url,
      category: 'inappropriate',
      reason,
      isActive: true
    });
    
    // Update tablet status if it was accessing this site
    const tablet = await this.getTablet(tabletId);
    if (tablet?.currentUrl?.includes(url)) {
      await this.updateTabletStatus(tabletId, 'blocked', true);
    }
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getStudentActivities(studentId: string, startDate?: string, endDate?: string): Promise<Activity[]> {
    let query = db.select().from(activities).where(eq(activities.studentId, studentId));
    
    if (startDate) {
      query = query.where(and(
        eq(activities.studentId, studentId),
        gte(activities.timestamp, new Date(startDate))
      ));
    }
    
    if (endDate) {
      query = query.where(and(
        eq(activities.studentId, studentId),
        lte(activities.timestamp, new Date(endDate))
      ));
    }
    
    return await query.orderBy(desc(activities.timestamp));
  }

  async getAlerts(resolved?: boolean): Promise<any[]> {
    let query = db
      .select({
        id: alerts.id,
        alertType: alerts.alertType,
        severity: alerts.severity,
        title: alerts.title,
        description: alerts.description,
        isResolved: alerts.isResolved,
        createdAt: alerts.createdAt,
        resolvedAt: alerts.resolvedAt,
        student: {
          id: students.id,
          name: students.name,
        },
        tablet: {
          id: tablets.id,
          tabletNumber: tablets.tabletNumber,
        }
      })
      .from(alerts)
      .leftJoin(students, eq(alerts.studentId, students.id))
      .leftJoin(tablets, eq(alerts.tabletId, tablets.id));
    
    if (resolved !== undefined) {
      query = query.where(eq(alerts.isResolved, resolved));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async resolveAlert(id: string, resolvedBy: string): Promise<Alert> {
    const [alert] = await db
      .update(alerts)
      .set({
        isResolved: true,
        resolvedBy,
        resolvedAt: new Date()
      })
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  async getBlockedSites(): Promise<BlockedSite[]> {
    return await db.select().from(blockedSites).orderBy(desc(blockedSites.createdAt));
  }

  async createBlockedSite(insertSite: InsertBlockedSite): Promise<BlockedSite> {
    const [site] = await db
      .insert(blockedSites)
      .values(insertSite)
      .returning();
    return site;
  }

  async deleteBlockedSite(id: string): Promise<void> {
    await db.delete(blockedSites).where(eq(blockedSites.id, id));
  }

  async getSecurityPolicies(): Promise<SecurityPolicy[]> {
    return await db.select().from(securityPolicies).where(eq(securityPolicies.isActive, true));
  }

  async createSecurityPolicy(insertPolicy: InsertSecurityPolicy): Promise<SecurityPolicy> {
    const [policy] = await db
      .insert(securityPolicies)
      .values(insertPolicy)
      .returning();
    return policy;
  }

  async updateSecurityPolicy(id: string, updates: Partial<InsertSecurityPolicy>): Promise<SecurityPolicy> {
    const [policy] = await db
      .update(securityPolicies)
      .set(updates)
      .where(eq(securityPolicies.id, id))
      .returning();
    return policy;
  }

  async getDashboardStats(): Promise<{
    activeTablets: number;
    totalTablets: number;
    activeAlerts: number;
    averageTime: number;
    blockedSites: number;
  }> {
    const [totalTablets] = await db
      .select({ count: count() })
      .from(tablets);

    const [activeTablets] = await db
      .select({ count: count() })
      .from(tablets)
      .where(eq(tablets.status, 'online'));

    const [activeAlerts] = await db
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.isResolved, false));

    const [activeSites] = await db
      .select({ count: count() })
      .from(blockedSites)
      .where(eq(blockedSites.isActive, true));

    // Calculate average screen time
    const tabletsWithTime = await db
      .select({ screenTime: tablets.screenTime })
      .from(tablets)
      .where(eq(tablets.status, 'online'));
    
    const averageTime = tabletsWithTime.length > 0 
      ? Math.round(tabletsWithTime.reduce((sum, t) => sum + (t.screenTime || 0), 0) / tabletsWithTime.length)
      : 0;

    return {
      activeTablets: activeTablets.count,
      totalTablets: totalTablets.count,
      activeAlerts: activeAlerts.count,
      averageTime,
      blockedSites: activeSites.count,
    };
  }

  async generatePDFReport(type: string, startDate: string, endDate: string, studentId?: string): Promise<Buffer> {
    // In a real implementation, this would use PDFKit or similar
    // For now, return a simple buffer indicating PDF generation
    return Buffer.from(`PDF Report - Type: ${type}, Period: ${startDate} to ${endDate}${studentId ? `, Student: ${studentId}` : ''}`);
  }

  async generateExcelReport(type: string, startDate: string, endDate: string, studentId?: string): Promise<Buffer> {
    // In a real implementation, this would use ExcelJS or similar
    // For now, return a simple buffer indicating Excel generation
    return Buffer.from(`Excel Report - Type: ${type}, Period: ${startDate} to ${endDate}${studentId ? `, Student: ${studentId}` : ''}`);
  }
}

export const storage = new DatabaseStorage();
