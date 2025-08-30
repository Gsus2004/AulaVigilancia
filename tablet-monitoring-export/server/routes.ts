import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertTabletSchema, insertActivitySchema, insertAlertSchema, insertBlockedSiteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const studentData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(studentData);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: "Invalid student data" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  // Tablets
  app.get("/api/tablets", async (req, res) => {
    try {
      const tablets = await storage.getAllTablets();
      res.json(tablets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tablets" });
    }
  });

  app.post("/api/tablets", async (req, res) => {
    try {
      const tabletData = insertTabletSchema.parse(req.body);
      const tablet = await storage.createTablet(tabletData);
      res.json(tablet);
    } catch (error) {
      res.status(400).json({ error: "Invalid tablet data" });
    }
  });

  app.put("/api/tablets/:id/status", async (req, res) => {
    try {
      const { status, isBlocked } = req.body;
      const tablet = await storage.updateTabletStatus(req.params.id, status, isBlocked);
      res.json(tablet);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tablet status" });
    }
  });

  app.get("/api/tablets/:id/activity", async (req, res) => {
    try {
      const activities = await storage.getTabletActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tablet activities" });
    }
  });

  // Activities
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.get("/api/students/:id/activities", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const activities = await storage.getStudentActivities(
        req.params.id,
        startDate as string,
        endDate as string
      );
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student activities" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const { resolved } = req.query;
      const alerts = await storage.getAlerts(resolved === 'true');
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.put("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const { resolvedBy } = req.body;
      const alert = await storage.resolveAlert(req.params.id, resolvedBy);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve alert" });
    }
  });

  // Blocked Sites
  app.get("/api/blocked-sites", async (req, res) => {
    try {
      const sites = await storage.getBlockedSites();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocked sites" });
    }
  });

  app.post("/api/blocked-sites", async (req, res) => {
    try {
      const siteData = insertBlockedSiteSchema.parse(req.body);
      const site = await storage.createBlockedSite(siteData);
      res.json(site);
    } catch (error) {
      res.status(400).json({ error: "Invalid blocked site data" });
    }
  });

  // Reports
  app.get("/api/reports/export", async (req, res) => {
    try {
      const { type, format, startDate, endDate, studentId } = req.query;
      
      if (format === 'pdf') {
        const pdfBuffer = await storage.generatePDFReport(
          type as string,
          startDate as string,
          endDate as string,
          studentId as string
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report-${type}-${Date.now()}.pdf"`);
        res.send(pdfBuffer);
      } else if (format === 'excel') {
        const excelBuffer = await storage.generateExcelReport(
          type as string,
          startDate as string,
          endDate as string,
          studentId as string
        );
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="report-${type}-${Date.now()}.xlsx"`);
        res.send(excelBuffer);
      } else {
        res.status(400).json({ error: "Invalid format specified" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Emergency actions
  app.post("/api/emergency/lock-all", async (req, res) => {
    try {
      await storage.lockAllTablets();
      res.json({ success: true, message: "All tablets locked" });
    } catch (error) {
      res.status(500).json({ error: "Failed to lock tablets" });
    }
  });

  app.post("/api/tablets/:id/block-site", async (req, res) => {
    try {
      const { url, reason } = req.body;
      await storage.blockSiteForTablet(req.params.id, url, reason);
      res.json({ success: true, message: "Site blocked" });
    } catch (error) {
      res.status(500).json({ error: "Failed to block site" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
